var Field = (function () {
    var arrayCopy = [];
    var array = [];
    var width = 50;
    var height = 50;
    var pixelOnSide = 10;
    var deltaForLine = 1;
    var colorFill = '#000';
    var colorEmpty = '#fff';

    return {
        init: function () {
            for (var i = 0; i < width; i++) {
                array[i] = [];
                arrayCopy[i] = [];
                for (var j = 0; j < height; j++) {
                    array[i][j] = arrayCopy[i][j] = false;
                }
            }

            this.drawGrid();
        },
        fillFieldByRandom: function (percent) {
            // percent - шанас выпадения живой клетки


            if(percent >1 || percent < 0){
                percent = 0
            }



            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    array[i][j] = arrayCopy[i][j] = (Math.random() < percent) ? true : false;
                }
            }

            this.drawField();
        },
        getCell: function (i, j) {
            return array[i][j];
        },
        setCell: function (i, j, value) {
            array[i][j] = value;
        },
        getCellCopy: function (i, j) {
            return arrayCopy[i][j];
        },
        getColorFill: function () {
            return colorFill;
        },
        getColorEmpty: function () {
            return colorEmpty;
        },
        fieldArrayToCopy: function () {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    arrayCopy[i][j] = array[i][j];
                }
            }
        },
        fieldMap: function (fn) {
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    fn(i, j);
                }
            }
        },
        drawField: function () {
            CanvasManager.clear();

            var side = pixelOnSide - deltaForLine;
            for (var i = 0; i < width; i++) {
                for (var j = 0; j < height; j++) {
                    if (array[i][j]) {
                        CanvasManager.fillRect(i * pixelOnSide + deltaForLine, j * pixelOnSide + deltaForLine, side, side);
                    }
                }
            }
        },
        drawGrid: function () {

            //Начинаем с 0,5 для получения линий в 1 пиксель
            for (var x = 0.5; x <= width * pixelOnSide + 1;
                    x += pixelOnSide) {
                CanvasManager.line(0, x, width * pixelOnSide, x);
            }

            for (var y = 0.5; y < height * pixelOnSide + 1;
                    y += pixelOnSide) {
                CanvasManager.line(y, 0, y, height * pixelOnSide);
            }

            CanvasManager.stroke(this.getColorFill());

        },
        countNear1: function (x, y) {
            var count = 0;
            for (var i = -1; i < 2; i++) {
                //Проверка на выход за границы поля
                if (x + i < 0 || x + i > width - 1) {
                    continue;
                }
                for (var j = -1; j < 2; j++) {
                    //Проверка на выход за границы поля
                    if (y + j < 0 || y + j > height - 1
                            || (i === 0 && j === 0))
                    {
                        continue;
                    }

                    if (arrayCopy[x + i][y + j]) {
                        count++;
                    }
                }
            }
            return count;
        },
        fillCellOnMousePos: function (event) {

            if (!Input.getIsMouseDown()) {
                return;
            }

            if (LifeGame.getStatus() !== LifeGameSTATUS.FIELD_SET) {
                return;
            }

            var mousePos = Input.getCursorPosition(event);
            mousePos = CanvasManager.getCanvasCursorPosition(mousePos);

            mousePos.x = parseInt(mousePos.x / pixelOnSide);
            mousePos.y = parseInt(mousePos.y / pixelOnSide);

            if (mousePos.x > width - 1 || mousePos.y > height - 1)
            {
                return;
            }

            var side = pixelOnSide - deltaForLine;

            var rectangle = {
                left: mousePos.x * pixelOnSide + deltaForLine,
                top: mousePos.y * pixelOnSide + deltaForLine
            };

            if (event.shiftKey) {
                array[mousePos.x][mousePos.y] = false;
            } else {
                array[mousePos.x][mousePos.y] = true;
            }

            CanvasManager.setFillStyle(array[mousePos.x][mousePos.y] ? colorFill : colorEmpty);
            CanvasManager.fillRect(rectangle.left, rectangle.top, side, side);
        },
        countNear1OnClick: function (event) {

            var mousePos = Input.getCursorPosition(event);
            mousePos = CanvasManager.getCanvasCursorPosition(mousePos);

            mousePos.x = parseInt(mousePos.x / pixelOnSide);
            mousePos.y = parseInt(mousePos.y / pixelOnSide);

            if (mousePos.x > width - 1 || mousePos.y > height - 1)
            {
                return;
            }


            if (event.shiftKey) {
                var count = Field.countNear1(mousePos.x, mousePos.x);
                console.log(mousePos.x,mousePos.y,count);
            }
        }




    };
})();
