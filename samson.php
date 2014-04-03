<?php
namespace samson\js\gallery;

/**
 * Интерфейс для подключения модуля в ядро фреймворка SamsonPHP
 *
 * @package SamsonPHP
 * @author Vitaly Iegorov <vitalyiegorov@gmail.com>
 * @author Nikita Kotenko <nick.w2r@gmail.com>
 * @version 0.1
 */
class JSSlider extends \samson\core\CompressableExternalModule
{	
	/** Identifier */
	protected $id = 'sjsslider';
	
	/** Module dependencies */
	protected $requirements = array('SamsonJS');
}