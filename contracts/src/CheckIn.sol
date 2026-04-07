// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Daily on-chain check-in for Base (gas only, no ETH attached).
contract CheckIn {
    uint256 internal constant SECONDS_PER_DAY = 86400;

    mapping(address user => uint256 dayIndex) public lastCheckInDay;
    mapping(address user => uint256 streak) public streakOf;

    error AlreadyCheckedInToday();

    event CheckedIn(address indexed user, uint256 indexed dayIndex, uint256 streak);

    /// @notice One successful check-in per UTC calendar day (dayIndex = timestamp / 86400).
    /// @dev Non-payable: transactions with `value` revert before execution.
    function checkIn() external {
        uint256 day = block.timestamp / SECONDS_PER_DAY;
        uint256 last = lastCheckInDay[msg.sender];

        // last == 0 means never checked in (distinct from day index 0).
        if (last != 0 && last == day) revert AlreadyCheckedInToday();

        uint256 newStreak;
        if (last == 0) {
            newStreak = 1;
        } else if (last == day - 1) {
            newStreak = streakOf[msg.sender] + 1;
        } else {
            newStreak = 1;
        }

        lastCheckInDay[msg.sender] = day;
        streakOf[msg.sender] = newStreak;

        emit CheckedIn(msg.sender, day, newStreak);
    }
}
