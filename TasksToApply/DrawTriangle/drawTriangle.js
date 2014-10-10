function init() {
    'use strict';

    var
        clearBtn,
        fillColor,
        strokeColor,
        defaultColor,
        strokeLineWidth,
        colorFillSelector,
        colorStrokeSelector,
        strokeLineWidthSelector,
        pointsCounter, canvas, ctx;

    var
        image = document.createElement('img'),
        imageBox = document.createElement('div'),
        buttonRow = document.createElement('div'),
        imageHeader = document.createElement('div'),
        loadButton = document.createElement('input'),
        removeButton = document.createElement('input'),
        galleryBox = document.getElementById('gallery');

    applyButtonRowAttributes(buttonRow);
    applyButtonAttributes(loadButton, 'Load');
    applyButtonAttributes(removeButton, 'Remove');

    loadGallery();

    // Get colors
    defaultColor = '#000000';

    // Vanilla ice ice baby...
    colorFillSelector = document.getElementById("fillColor");
    colorFillSelector.addEventListener('change', function () {
        fillColor = colorFillSelector.value;
    });
    fillColor = colorFillSelector.value || defaultColor;

    colorStrokeSelector = document.getElementById("strokeColor");
    colorStrokeSelector.addEventListener('change', function () {
        strokeColor = colorStrokeSelector.value;
    });
    strokeColor = colorStrokeSelector.value || defaultColor;

    // Get stroke line width
    strokeLineWidthSelector = document.getElementById("lineWidth");
    strokeLineWidthSelector.addEventListener('change', function () {
        strokeLineWidth = strokeLineWidthSelector.value;
    });
    strokeLineWidth = strokeLineWidthSelector.value || 0;

    canvas = document.getElementById("drawTriangle");
    ctx = canvas.getContext("2d");

    pointsCounter = 0;
    canvas.addEventListener('click', function (event) {
        var coordinates = getMouseCoordinates();
        draw(coordinates[0], coordinates[1]);
    });

    function loadGallery() {
        for (var key in localStorage) {
            addToGallery(key);
        }
    }

    function getMouseCoordinates() {
        var x, y, margins = 20;

        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - margins;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - margins;

        return [x, y];
    }

    function draw(x, y) {
        pointsCounter += 1;
        if (pointsCounter === 1) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        } else if (pointsCounter === 2) {
            ctx.lineTo(x, y);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeLineWidth;
            ctx.stroke();
        } else if (pointsCounter === 3) {
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
            ctx.stroke();
            ctx.fillStyle = fillColor;
            ctx.fill();
            pointsCounter = 0;
        }
    }

    // Clear canvas
    clearBtn = document.getElementById('clearBtn');
    clearBtn.addEventListener('click', function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    var saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', function () {
        var fileName, fileID, confirmedName = false;

        fileName = prompt('Enter file name to save your art shedevr: ', 'untitled');
        fileID = fileName.toString().replace(' ', '_');
        if (fileName !== null && fileName.length > 0) {
            if (localStorage.getItem(fileName) === null) {
                addToLocalStorage(fileName);
                addToGallery(fileName);
            } else {
                confirmedName = confirm('Local storage already contains image with name "' + fileName + '". Replace the previous image?');
                if (confirmedName) {
                    removeImage(fileName, fileID);
                    addToLocalStorage(fileName);
                    addToGallery(fileName);
                } else {
                    console.log('image is not saved');
                }
            }
        }
    });

    function addToLocalStorage(key) {
        localStorage.setItem(key, canvas.toDataURL());
    }

    function addToGallery(key) {
        var currentImageBox, currentHeader, img,
            currentBtnRow, loadBtn, removeBtn;

        currentImageBox = imageBox.cloneNode(true);
        currentImageBox.classList.add('imageBox');
        currentImageBox.id = key.toString().replace(' ', '_');

        currentHeader = imageHeader.cloneNode(true);
        currentHeader.innerHTML = key;

        img = image.cloneNode(true);
        img.src = localStorage.getItem(key);

        currentBtnRow = buttonRow.cloneNode(true);

        loadBtn = loadButton.cloneNode(true);
        loadBtn.addEventListener('click', function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var img = new Image();
            img.src = localStorage.getItem(key);
            ctx.drawImage(img, 0, 0);
        });

        removeBtn = removeButton.cloneNode(true);
        removeBtn.addEventListener('click', function () {
            removeImage(key, currentImageBox.id);
        });

        currentBtnRow.appendChild(loadBtn);
        currentBtnRow.appendChild(removeBtn);

        currentImageBox.appendChild(currentHeader);
        currentImageBox.appendChild(img);
        currentImageBox.appendChild(currentBtnRow);
        galleryBox.appendChild(currentImageBox);
    }

    // Remove from local storage and from gallery too
    function removeImage(key, id) {
        localStorage.removeItem(key);
        var imageBoxToRemove = document.getElementById(id);
        galleryBox.removeChild(imageBoxToRemove);
    }

    function applyButtonRowAttributes(buttonRow) {
        buttonRow.classList.add('button-row');
    }

    function applyButtonAttributes(textButton, value) {
        textButton.type = 'button';
        textButton.classList.add('textBtn');
        textButton.value = value;
        return textButton;
    }
}

onload = init;

// TODO: Refactoring - separate drawing logic and storage logic