/** Random number in interval [min,max) */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
 
/** Returns random color from predefined set */
function getRandomColor() {
    // Color may be repeated to increase its frequency
    const colors = [
        "black",
        "red", "red", "red",
        "blue", "blue", "blue",
        "yellow", "yellow", "yellow",
        "white", "white", "white", "white", "white"
    ];
    return colors[getRandomInt(0, colors.length)];
}

/** Draws a rectangle with random color */
function drawRandomRect(ctx, rect) {
    let color = getRandomColor();
    ctx.fillStyle = color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

/** Draws a horizontal or vertical line on top or left side of a rect */
function drawBoundaryLine(ctx, rect, isHorizontal) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.moveTo(rect.x, rect.y);
    if (isHorizontal) {
        ctx.lineTo(rect.x + rect.width, rect.y);
    } else {
        ctx.lineTo(rect.x, rect.y + rect.height);
    }
    ctx.stroke();
}

/** Calculates N random intervals from start to end */
function calcIntervals(count, start, end, minimum) {
    // Checks if a boundary position is correct
    // Straightforward O(n**2) solution, needs improvement
    function checkNewBoundary(newBoundary) {
        for (let boundary of intervals) {
            if (Math.abs(newBoundary - boundary) < minimum)
                return false;
        }
        if ((end - newBoundary) < minimum)
            return false;
        return true;
    }

    // Calculate the interval boundaries from start to end
    var intervals = [start];
    for (let i = 0; i < count - 1; i++) {
        // Get a random boundary until it fits
        let boundary;
        do {
            boundary = getRandomInt(start, end);
        }
        while (!checkNewBoundary(boundary));
        intervals.push(boundary);
    }
    intervals.push(end);
    intervals.sort((a, b) => a - b);    
    return intervals;
}

/** Divides rectangle into */
function divide(rect, horizontal, minSize) {
    let start = horizontal ? rect.y : rect.x;
    let end = horizontal ? start + rect.height : start + rect.width;

    // Calculate number of parts
    const DIVISION_OPTIONS = [2,2,3,4];
    let partsCount = DIVISION_OPTIONS[getRandomInt(0, DIVISION_OPTIONS.length)];
    let maxParts = Math.floor((end - start) / minSize);
    partsCount = Math.min(partsCount, maxParts);

    // Calculate intervals for divison
    let intervals = calcIntervals(partsCount, start, end, minSize/2); // Reducing minimum size to avoid performance issues

    // Calculate parts
    let parts = [];
    for (let i = 0; i < partsCount; i++) {
        let part;
        if (horizontal) {
            part = {x: rect.x, y: intervals[i], width: rect.width, height: (intervals[i+1] - intervals[i])};
        } else {
            part = {x: intervals[i], y: rect.y, width: (intervals[i+1] - intervals[i]), height: rect.height};
        }
        parts.push(part);        
    }
    return parts;
}

/** Recursively draws the picture */
function draw(ctx, rect, horzDivision, level, maxLevel, minSize) {
    // Check if minumum size of a part has been reached
    function checkSize(part) {
        return horzDivision ? part.height > minSize : part.width > minSize;
    }
    
    // Divide the rect into parts horizontally or vertically
    let parts = divide(rect, horzDivision, minSize);

    // Divide the parts further or fill them
    for (let part of parts) {
        if (level < maxLevel && checkSize(part)) {
            // Recursion
            draw(ctx, part, !horzDivision, level + 1, maxLevel, minSize);
        } else {
            // Draw this part
            drawRandomRect(ctx, part);
        }
    }

    // Draw the dividing lines over the fills
    for (let i = 0; i < parts.length; i++) {
        if (i > 0)
            drawBoundaryLine(ctx, parts[i], horzDivision);
    }    
}

/**
 * Draws the Mondriaan-inspired picture on a canvas inside of specified rectangle area
 */
function mondriaan(canvas, x, y, width, height) {
    const ctx = canvas.getContext("2d");
    let startRect = {x: x, y: y, width: width, height: height};

    // Draw the picture
    draw(ctx, startRect, true, 0, 3, 50);

    // Draw the outline
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
}