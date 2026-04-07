// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CheckIn} from "../src/CheckIn.sol";

contract CheckInTest is Test {
    CheckIn public c;

    address alice = address(0xA11CE);

    function setUp() public {
        c = new CheckIn();
    }

    function test_first_check_in() public {
        vm.warp(86400 * 42);
        vm.prank(alice);
        c.checkIn();
        assertEq(c.streakOf(alice), 1);
        assertEq(c.lastCheckInDay(alice), 42);
    }

    function test_RevertWhen_second_check_in_same_day() public {
        vm.warp(86400 * 500);
        vm.startPrank(alice);
        c.checkIn();
        vm.expectRevert(CheckIn.AlreadyCheckedInToday.selector);
        c.checkIn();
        vm.stopPrank();
    }

    function test_second_day_increments_streak() public {
        vm.warp(86400 * 1000);
        vm.prank(alice);
        c.checkIn();
        vm.warp(86400 * 1001);
        vm.prank(alice);
        c.checkIn();
        assertEq(c.streakOf(alice), 2);
    }

    function test_gap_resets_streak() public {
        vm.warp(86400 * 2000);
        vm.prank(alice);
        c.checkIn();
        vm.warp(86400 * 2003);
        vm.prank(alice);
        c.checkIn();
        assertEq(c.streakOf(alice), 1);
    }

    function test_RevertWhen_sends_eth() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        (bool ok,) = address(c).call{value: 1 wei}(abi.encodeCall(CheckIn.checkIn, ()));
        assertFalse(ok);
    }
}
