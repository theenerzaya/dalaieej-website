<?php
function hoteller_theme_load() {
	load_theme_textdomain( 'hoteller', get_template_directory().'/languages' );
}
add_action( 'init', 'hoteller_theme_load' );
?>