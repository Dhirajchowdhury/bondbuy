// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BondRegistry
 * @notice Canonical on-chain registry for government bond metadata
 * @dev Append-only registry - bonds cannot be deleted, only paused/resumed.
 *      Designed for read-heavy frontend usage. Payments handled on Solana.
 */
contract BondRegistry {
    
    // ═══════════════════════════════════════════════════════════════════
    //                              STRUCTS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Bond metadata structure
     * @param name Human-readable bond name (e.g., "India G-Sec 2030")
     * @param apy Annual yield in basis points (718 = 7.18%)
     * @param maturity UNIX timestamp when bond matures
     * @param totalSupply Maximum units available
     * @param issuedSupply Units already issued (starts at 0)
     * @param active Whether bond is available for purchase
     */
    struct Bond {
        string name;
        uint256 apy;
        uint256 maturity;
        uint256 totalSupply;
        uint256 issuedSupply;
        bool active;
    }

    // ═══════════════════════════════════════════════════════════════════
    //                           STATE VARIABLES
    // ═══════════════════════════════════════════════════════════════════

    /// @notice Contract administrator (set to deployer)
    address public immutable admin;

    /// @notice Sequential bond counter (IDs start from 1)
    uint256 private _bondCount;

    /// @notice Bond ID => Bond data
    mapping(uint256 => Bond) private _bonds;

    // ═══════════════════════════════════════════════════════════════════
    //                              EVENTS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Emitted when a new bond is created
     * @param bondId Sequential bond identifier
     * @param name Bond name
     * @param apy APY in basis points
     * @param maturity Maturity timestamp
     * @param totalSupply Total units available
     */
    event BondCreated(
        uint256 indexed bondId,
        string name,
        uint256 apy,
        uint256 maturity,
        uint256 totalSupply
    );

    /**
     * @notice Emitted when bond active status changes
     * @param bondId Bond identifier
     * @param active New status (true = active, false = paused)
     */
    event BondStatusUpdated(uint256 indexed bondId, bool active);

    // ═══════════════════════════════════════════════════════════════════
    //                              ERRORS
    // ═══════════════════════════════════════════════════════════════════

    error Unauthorized();
    error BondNotFound();
    error EmptyName();
    error InvalidAPY();
    error InvalidMaturity();
    error InvalidSupply();

    // ═══════════════════════════════════════════════════════════════════
    //                             MODIFIERS
    // ═══════════════════════════════════════════════════════════════════

    /// @notice Restricts access to admin only
    modifier onlyAdmin() {
        if (msg.sender != admin) revert Unauthorized();
        _;
    }

    // ═══════════════════════════════════════════════════════════════════
    //                            CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════════════

    /// @notice Sets deployer as admin
    constructor() {
        admin = msg.sender;
    }

    // ═══════════════════════════════════════════════════════════════════
    //                         ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Creates a new bond entry
     * @param name Bond name (cannot be empty)
     * @param apy APY in basis points (1-10000, i.e., 0.01% to 100%)
     * @param maturity UNIX timestamp (must be in future)
     * @param totalSupply Total units (must be > 0)
     * @return bondId The new bond's sequential ID
     */
    function createBond(
        string calldata name,
        uint256 apy,
        uint256 maturity,
        uint256 totalSupply
    ) external onlyAdmin returns (uint256 bondId) {
        // Validate inputs
        if (bytes(name).length == 0) revert EmptyName();
        if (apy == 0 || apy > 10000) revert InvalidAPY();
        if (maturity <= block.timestamp) revert InvalidMaturity();
        if (totalSupply == 0) revert InvalidSupply();

        // Generate sequential ID (starts from 1)
        bondId = ++_bondCount;

        // Store bond
        _bonds[bondId] = Bond({
            name: name,
            apy: apy,
            maturity: maturity,
            totalSupply: totalSupply,
            issuedSupply: 0,
            active: true
        });

        emit BondCreated(bondId, name, apy, maturity, totalSupply);
    }

    /**
     * @notice Pauses or resumes a bond
     * @param bondId Bond to update
     * @param active New status
     */
    function setBondActive(uint256 bondId, bool active) external onlyAdmin {
        if (!_exists(bondId)) revert BondNotFound();
        
        _bonds[bondId].active = active;
        emit BondStatusUpdated(bondId, active);
    }

    // ═══════════════════════════════════════════════════════════════════
    //                        PUBLIC VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * @notice Returns bond data by ID
     * @param bondId Bond identifier
     * @return Bond struct
     */
    function getBond(uint256 bondId) external view returns (Bond memory) {
        if (!_exists(bondId)) revert BondNotFound();
        return _bonds[bondId];
    }

    /**
     * @notice Checks if bond ID exists
     * @param bondId Bond identifier
     * @return True if bond exists
     */
    function bondExists(uint256 bondId) external view returns (bool) {
        return _exists(bondId);
    }

    /**
     * @notice Returns all bonds as array
     * @dev Optimized for frontend batch reads
     * @return Array of all Bond structs
     */
    function getAllBonds() external view returns (Bond[] memory) {
        Bond[] memory bonds = new Bond[](_bondCount);
        
        for (uint256 i = 1; i <= _bondCount; i++) {
            bonds[i - 1] = _bonds[i];
        }
        
        return bonds;
    }

    /**
     * @notice Returns total number of bonds
     * @return Current bond count
     */
    function bondCount() external view returns (uint256) {
        return _bondCount;
    }

    // ═══════════════════════════════════════════════════════════════════
    //                        INTERNAL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    /// @dev Checks if bond ID is valid
    function _exists(uint256 bondId) internal view returns (bool) {
        return bondId > 0 && bondId <= _bondCount;
    }
}
