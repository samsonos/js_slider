/**
 * SamsonJS Slider plugin
 */
var SamsonJSSlider =
{
	slider : function( options )
	{
        var sliderParent = this.parent();
		if(!options) options = {};
		var lbtn = options.leftButton ? options.leftButton : s('.arrow-left', sliderParent);
		var rbtn = options.rightButton ? options.rightButton : s('.arrow-right', sliderParent);
		var stars = options.starsBlock ? options.starsBlock : null;
		var middleHandler = options.middleHandler ? options.middleHandler : null;
		var startFrom = options.startFrom ? options.startFrom : null;
        var autoScroll = !options.autoScroll ? options.autoScroll : true;
        // num - количество отображаемых элементов в слайдере, если листание происходит по одному элементу.
        var num = options.num ? options.num : 1;

        // Set default scroll speed
        var scrollSpeed = 300;
        if (options.scrollSpeed !== undefined) {
            // Set users scroll speed
            scrollSpeed = options.scrollSpeed;
        }

        // Set default scroll interval - 3 sec
        var scrollInterval = 3000;
        if (options.scrollInterval !== undefined) {
            // Set users scroll interval
            scrollInterval = options.scrollInterval;
        }

		var timer;

		// Если есть выборка элементов DOM
		if( this.length )
		{
			//Слайдер
			var slider = this;

            // Update overflow only if it is not set yet
            if(slider.css('overflow') == '' || slider.css('overflow') == 'undefined' || slider.css('overflow-y') == '' || slider.css('overflow-y') == 'undefined') {
                slider.css('overflow', 'hidden');
            }

            // Update position only if it is not set yet
			if(slider.css('position') == '' || slider.css('position') == 'undefined') {
                slider.css('position', 'relative');
            }

			// Ширина слайда
			var slideWidth = slider.width()/num;
            // Высота слайда
			var slideHeight = slider.height();

			// Коллекция слайдов
			var slides = s('.sjs-slide',slider);

			slides.each(function(li_obj){
				li_obj.css('display', 'block');
				li_obj.css('position', 'absolute');
				li_obj.css('top', '0px');
                if (num < 2) {
                    li_obj.width(slideWidth);
                    li_obj.height(slideHeight);
                }
			});

			s('.sjs-slider', slider).css('list-style','none');
			s('.sjs-slider', slider).css('position','relative');
			s('.sjs-slider', slider).height(slideHeight);

			// Максимальное значение скрола
			var slidesCount = slides.length;

			// Если в указанном контейнере вообще есть картинки
			if( slidesCount )
			{
				if(stars) {
                    // If there are stars
                    var existingStars = s('li', stars);
                    // Set their attributes, but don't create new one
                    for (var eStarsCounter = 0; eStarsCounter < existingStars.length; eStarsCounter++) {
                        existingStars.elements[eStarsCounter].DOMElement.setAttribute('slide_id', eStarsCounter.toString());
                    }

                    for (var int = eStarsCounter; int < slidesCount; int++) {
                        var star_li = '<li slide_id="' + int + '">';
                        if (slides.elements[int].DOMElement.hasAttribute('thumbnail')) {
                            star_li += '<img src="' + slides.elements[int].a('thumbnail') + '">';
                        }
                        star_li += '</li>';
                        stars.append(s(star_li));
                    }
                }
                // Если листание происходит по одному элементу, задается смещение для каждого элемента,
                // иначе - только для первого
                if(num != 1) {
                    for (var i = 0; i < slidesCount; i++) {
                        slides.elements[i].css('left', (slideWidth + slideWidth * i) + 'px');
                    }
                } else {
                    slides.elements[ 0 ].css('left', slideWidth+'px');
                }

                // Текущий отображаемый элемент
				var current = 0;

				var c_busy = false;

				s('.sjs-slider', slider).css('width', slideWidth*3+'px');
				s('.sjs-slider', slider).css('left', -slideWidth+'px');

				var goToSlide = function(id, direction)
				{
					c_busy = true;

					s( slides.elements[ id ] ).css('display', 'block');
					point = 0;
					if (direction){
						s( slides.elements[ id ] ).css('left', slideWidth*2+'px');
						point = -slideWidth*2;
					}
					else{
						s( slides.elements[ id ] ).css('left', '0px');
						point = 0;
					}
					if(options.startHandler)options.startHandler(slides.elements[ id ], id);
					myanimate(s('.sjs-slider', slider), point, scrollSpeed,
							function()
							{
								//s.trace('end');
								slides.each(function(eachObj){
									eachObj.css('display', 'none');
								});

                                for (var i = 0; i <= num; i++){
                                    var ind = id+i;
                                    if (ind > slidesCount-1) ind -= slidesCount;
                                    s( slides.elements[ ind ] ).css('display', 'block');
                                    s( slides.elements[ ind ] ).css('left', slideWidth+slideWidth*i+'px');
                                }

								s('.sjs-slider', slider).css('left', -slideWidth+'px');

								if(stars){
									s('li', stars).each(function(star_obj){
										star_obj.removeClass('active');
									});

									s( s('li', stars).elements[ id ] ).addClass('active');
								}
								if(options.slideHandler)options.slideHandler(slides.elements[ id ], id);
								clearTimeout(timer);
                                if (autoScroll) {
                                    setTimer();
                                }

								c_busy = false;
							}, 50,{'middle': middleHandler}, id);
				};

				if (rbtn)rbtn.click( function( btn )
				{
					if(!c_busy)
					{
						if( current < slidesCount - 1 ) current++;
						else current = 0;

						goToSlide(current, 1);
					}
				});

				if (lbtn)lbtn.click( function(btn)
				{
					if(!c_busy)
					{
						if( current > 0 ) current--;
						else current = slidesCount - 1;

						goToSlide(current, 0);
					}
				});

                var lastTouchX;
                var currentTouchX;

                this.DOMElement.addEventListener("touchstart", function(e) {
                    lastTouchX = parseInt(e.changedTouches[0].pageX);
                }, false);

                this.DOMElement.addEventListener("touchend", function(e) {
                    currentTouchX = parseInt(e.changedTouches[0].pageX);

                    if (currentTouchX > lastTouchX) {
                        if (!c_busy) {
                            if( current > 0 ) current--;
                            else current = slidesCount - 1;
                            goToSlide(current, 0);
                        }
                    } else if(currentTouchX < lastTouchX){
                        if (!c_busy) {
                            if( current < slidesCount - 1 ) current++;
                            else current = 0;
                            goToSlide(current, 1);
                        }
                    }
                }, false);

				if (stars){
					s( s('li', stars).elements[ 0 ] ).addClass('active');

					s('li', stars).click(function(li_obj){
						if(!c_busy && !li_obj.hasClass('active'))
						{
							dslide = parseInt(li_obj.a('slide_id'));
							if( current < dslide ) {current = dslide; goToSlide(current, 1);}
							else {current = dslide; goToSlide(current, 0);}
						}
					});
				};

				var setTimer = function(){
					timer = setTimeout(function()
							{
								if(!c_busy)
								{
									if( current < slidesCount - 1 ) current++;
									else current = 0;
									goToSlide(current, 1);
								}

							}, scrollInterval);
				};

				if (autoScroll) {
                    setTimer();
                }
			}
		}

		var myanimate = function( obj, fValue, time, finishHandler, frame_count, handler, id )
		{
			// Определим скорость анимации
			switch( time )
			{
				case 'slow'		: time = 400;	break;
				case 'fast'		: time = 200; 	break;
				case undefined	: time = 300; 	break;
			}

			// Определим количество кадров в секунду анимации, по умолчанию 30
			frame_count = frame_count ? frame_count : 24;

			// Рассчитаем интервал срабатывания таймера, как количество кадров в секунду и переведем в мс
			var animation_timer =  1000 / frame_count;

			// Рассчитаем кооличество шагов анимации которые необходимо выполнить за данное время
			var animation_steps_count = time / animation_timer;

			//s.trace(animation_steps_count);
			//s.trace(obj);
				// Получим текущее значение параметра элемента
				var cValue = obj.css('left');

				cValue = parseInt(cValue.replace(/px/gi, ''));

				// Определим направление изменения размера элемента
				var direction = ( fValue > cValue ) ? 1 : -1;

				// Переменная для хранения экземпляра таймера для его остановки
				var animation = null;
				//s.trace(distance+' - '+animation_steps_count);
				// Рассчтиаем "величину" изменения параметра
				var distance = Math.abs(Math.abs(fValue) - Math.abs(cValue));

				// Пройденный путь
				var traveled = 0;

				var middle = false;

				//s.trace('distance - '+distance);
				// Рассчитаем шаг изменения параметра анимации за один кадр анимации
				var animation_step = Math.round(Math.abs( distance / animation_steps_count));

				//s.trace('FC:'+frame_count+',Start:'+cValue+', Stop:'+fValue+',Step:'+animation_step+',Distance:'+distance+',Timer:'+animation_timer);

				// Запустим интервал для анимации скроллинга элемента
				animation = setInterval( function()
				{
					// Поправочное условия для изменения величины шага изменения параметра для точного попадания в граничное условие
					if( Math.abs(Math.abs(fValue)  - Math.abs(cValue) ) < animation_step ) animation_step = Math.abs(Math.abs(fValue)  - Math.abs(cValue) );

					traveled+=animation_step;

					//clearInterval( animation );
					//s.trace( 'Анимированное изменение параметра("'+paramName+'") элемента ['+cValue+','+fValue+','+animation_step+']');

					// Изменим значение параметра элемента на величину шага учитывая направление изменений
					cValue = cValue + (direction*animation_step);

					if( (!middle)&&(traveled>Math.abs(distance/2)) )
					{
						middle = true;
						if ((typeof handler === 'object') && (handler.middle)) handler.middle(obj, id);
					}


					// Установим новое значение параметра элемента
					//handler( cValue );
					obj.css('left', cValue+'px');

					// Если нам нечего больше изменять и мы дошли до необходимого значения параметра
					if( animation_step === 0 )
					{
						// Если задан обработчик завершения прорисовки выполним его
						if( finishHandler ) finishHandler();

						// Отменим анимацию
						clearInterval( animation );
					}

				}, animation_timer );

		};

        if (startFrom && startFrom != 0) {
            goToSlide(startFrom, 1);
            current = startFrom;
        }

        // Вернем указатель на себя
		return this;
	}
};

// Добавим плагин к SamsonJS
SamsonJS.extend( SamsonJSSlider );
