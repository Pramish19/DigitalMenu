<?php
session_start(); // session start gareko

// session destroy gareko user lai logout garna lai
session_unset();  // session ko sabbai variables like user ko credentials lai remove gareko yo chai
session_destroy(); // yeha destroy vayo

// Login page ma redirect garna lai logout vaye paxi
header("Location: login.html"); // ka redirect hune vane ra yeha define gareko
exit();
?>
