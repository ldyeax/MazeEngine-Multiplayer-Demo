<?php

$f = $_GET['f'];

echo "<option value=$f>$f</option>";

if ($handle = opendir('img')) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != ".." && $entry != $first) {
            echo "<option value=$entry>$entry</option>";
        }
    }
    closedir($handle);
}
?>