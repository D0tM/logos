var Logos = (function () {
  "use strict";
  var publicAPI = {};

  var defaults = {
    fontSizes: {
      medium: '1.3rem',
      large: '1.6rem'
    },
    readerMode: false
  };

  /* Options references */
  var target;
  var imageRef;
  var textContainer;
  var fontSizes;
  var readerMode;


  /* Elements to be injected */
  var pluginStyle;
  var fontSwitch;
  var readerModeButton;
  var readerModeModal;
  var imgUrl;
  var content;

  publicAPI.init = function (opts) {
    target = document.querySelector(opts.target);
    imageRef = document.querySelector(opts.imageRef);
    textContainer = document.querySelector(opts.textContainer);
    fontSizes = opts.fontSizes || defaults.fontSizes;
    readerMode = opts.readerMode || defaults.readerMode;

    create();
    render();
    bindEvents();
  }

  var create = function () {
    generateErrors();
    generateSwitch();
    if (readerMode) {
      preloadContent();
      generateReaderMode();
    };
    generateStyle();
  }

  var bindEvents = function () {
    /* Sets a listener to the parent and act based on the child who triggers the event */
    if (target) {
      var items = target.querySelectorAll('.switch__item');
      target.querySelector('.switch').addEventListener('click', function (e) {
        if (e.target.classList.contains('switch__item')) {
          /* Cleans every selection */
          Array.prototype.forEach.call(items, function (item) {
            item.removeAttribute('data-selected');
          });
          /* Sets current selected item */
          var curSize = e.target.getAttribute('data-size').trim();
          e.target.setAttribute('data-selected', 'true');

          /* Adds font size to the text container */
          switch (curSize) {
            case 'normal':
              textContainer.removeAttribute('style');
              break;
            case 'medium':
              textContainer.setAttribute('style', 'font-size:' + fontSizes.medium + '!important');
              break;
            case 'large':
              textContainer.setAttribute('style', 'font-size:' + fontSizes.large + '!important');
              break;
          }
        }
      });
      if (readerMode) {
        /* Opens the modal if reader mode button is clicked */
        var modal = document.querySelector('.rmModalWrap');
        target.querySelector('.readerMode').addEventListener('click', function () {

          /* Injects post image into the modal's header */
          modal.querySelector('.rmImgWrap').setAttribute('style', 'background-image:url("' + imgUrl + '")');
          modal.querySelector('img').src = imgUrl;

          /* Injects post content into the modal's body */
          modal.querySelector('.rmModal__body').innerHTML = content;

          document.body.classList.add('readingMode');

          modal.setAttribute('data-visible', 'true');
        });

        /* Closes the modal if close button is clicked */
        var closeButton = modal.querySelector('.rmButton');
        closeButton.addEventListener('click', function () {
          document.body.classList.remove('readingMode');
          modal.removeAttribute('data-visible');
        });
      }
    }
  }

  var generateErrors = function () {
    var throwError = false;
    if (!target) {
      console.error('Error: No taget element defined into options Object. Define a {target: ".mytarget || #mytarget"}.');
      throwError = true;
    }
    if (readerMode) {
      if (!imageRef) {
        console.error('Error: No image reference defined into options Object. Define a {imageRef: ".mytarget || #mytarget"}.');
        throwError = true;
      }
      if (!textContainer) {
        console.error('Error: No text container reference defined into options Object. Define a {textContainer: ".mytarget || #mytarget"}.');
        throwError = true;
      }
    }
    if (throwError) {
      return;
    }
  };

  var preloadContent = function () {
    imgUrl = imageRef.getAttribute('src').trim();
    content = textContainer.innerHTML;
  }

  var generateStyle = function () {
    /*Creates the style for the plugin*/
    var customStyle = document.createElement('style');
    var content = `
              .switch{
                font-size:0;
                text-align:right;
                margin-bottom:24px;
              }
              .switch > *{
                font-size: inherit;
              }
              .switch__item{
                display:inline-block;
                line-height:1;
                font-family: inherit;
                color: inherit;
                font-weight: bold;
                opacity: 0.5;
              }
              .switch__item:not(:last-child){
                margin-right: 6px;
              }
              .switch__item[data-selected]{
                opacity: 1;
              }
              .switch__item:first-child{
                font-size: 1.3rem;
              }
              .switch__item:nth-child(2){
                font-size: 1.6rem;
              }
              .switch__item:nth-child(3){
                font-size: 1.9rem;
              }
              .switch__item:hover{
                cursor:pointer;
                opacity: 0.7;
              }
            `;
    if (readerMode) {
      content += `
            .readerMode{
              display:inline-block;
              vertical-align:bottom;
              width:30px;
              height:30px;
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAADNJREFUSMdjGAX0APz///9gsP8PBQ2jAjQQGN6A/z8c/BkVoFxg2AOYbz+MClAuMApoBACnWHH/2fC5JAAAAABJRU5ErkJggg==);
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center center;
              font-size:0;
              opacity:0.3;
            }
            .readerMode:hover{
              cursor:pointer;
              opacity: 0.5;
            }
    
            .rmModal {
              position: relative;
              font-family: inherit;
            }
            .rmModalWrap {
              position: fixed;
              z-index: 999;
              width:100%;
              height:100%;
              max-height: 100%;
              overflow:hidden;
              overflow-y:scroll;
              background-color:#fff;
              padding: 24px;
              bottom: -70px;
              left:0;
              opacity: 0;
              visibility:hidden;
              transition: bottom 0.25s ease-in-out, opacity 0.25s ease-in-out, visibility 0.25s ease-in-out;
            }
            .rmModalWrap[data-visible] {
              bottom:0;
              opacity:1;
              visibility:visible;
              transition: bottom 0.25s ease-in-out, opacity 0.25s ease-in-out, visibility 0.25s ease-in-out;
            }
            
            .rmModal__head {
              margin-bottom: 24px;
            }
            
            .rmModal__body {
              padding-bottom: 24px;
            }
            @media screen and (min-width: 768px) {
              .rmModal__body, .rmModal__head{
                max-width:600px;
                margin:0 auto;
              }
            }
            @media screen and (min-width: 1024px) {
              .rmModal__body, .rmModal__head{
                max-width:800px;
                margin:0 auto;
              }
            }
            
            .rmImgWrap {
              background-position: center center;
              background-size: cover;
              background-repeat: no-repeat;
            }
            .rmImgWrap img {
              width: 100%;
              height: auto;
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
            }
            
            .rmButton {
              font-weight: bold;
              padding: 12px;
              border: 1px solid #000;
              color: #fff;
              background-color: #000;
              cursor:pointer;
            }
            .rmButtonWrap {
              text-align: center;
              position: fixed;
              bottom: 0px;
              left: 50%;
              transform: translateX(-50%);
            }
            body.readingMode{
              overflow:hidden;
            }
          `
    }
    customStyle.innerHTML = content;
    pluginStyle = customStyle;
  }

  var generateSwitch = function () {
    /*Creates the font size switch on the article*/
    var switcher = document.createElement('div');
    switcher.classList.add('switch');
    var switchItems = `
      <div class="switch__item" data-selected="true" tabindex="1" data-size="normal">a</div>
      <div class="switch__item" tabindex="1" data-size="medium">a</div>
      <div class="switch__item" tabindex="1" data-size="large">a</div>
    `;
    switcher.innerHTML = switchItems;
    fontSwitch = switcher;
  }

  var generateReaderMode = function () {
    if (readerMode) {
      /*Creates the reader mode button*/
      var rmButton = document.createElement('div');
      rmButton.classList.add('readerMode');
      rmButton.setAttribute('tabindex', '1');
      rmButton.innerText = 'Switch to reader mode.';
      readerModeButton = rmButton;

      /*Creates the reader mode modal*/
      var rmModal = document.createElement('div');
      rmModal.classList.add('rmModalWrap');
      rmModal.innerHTML = `
        <article class="rmModal">
          <header class="rmModal__head">
            <div class="rmImgWrap">
              <img src="" alt="">
            </div>
          </header>
          <div class="rmModal__body"></div>
          <div class="rmButtonWrap">
            <div class="rmButton">Close Reader Mode</div>
          </div>
        </article>
      `;
      readerModeModal = rmModal;
    }
  }

  var render = function () {
    var DOMhead = document.head;
    var DOMbody = document.body;
    /*Injects the style*/
    DOMhead.insertAdjacentElement('beforeend', pluginStyle);

    /*Injects the switch into target location*/
    if (target) {
      target.insertAdjacentElement('beforeend', fontSwitch);
    }

    if (readerMode) {
      /*Injects the reader mode button into target location, after font switch*/
      if (target) {
        target.querySelector('.switch').insertAdjacentElement('beforeend', readerModeButton);
      }

      /*Injects the reader mode modal at the end of the body*/
      DOMbody.insertAdjacentElement('beforeend', readerModeModal);
    }
  }

  return publicAPI;
})();