/**
 * @classdesc Curve style LineString, an abstract parent class for all the curves.
 * @class
 * @category geometry
 * @extends {maptalks.LineString}
 */
Z.Curve = Z.LineString.extend(/** @lends maptalks.Curve.prototype */{

    _arc: function (ctx, points, lineOpacity) {
        var degree = this.options['arcDegree']  * Math.PI / 180;
        for (var i = 1, l = points.length; i < l; i++) {
            Z.Canvas._arcBetween(ctx, points[i - 1], points[i], degree);
            Z.Canvas._stroke(ctx, lineOpacity);
        }
    },

    _getQuadCurvePoints : function (points) {
        var ctrlPts = [];
        var i, len = points.length;
        var xc, yc;
        for (i = 1; i < len - 1; i++) {
            xc = (points[i].x + points[i + 1].x) / 2;
            yc = (points[i].y + points[i + 1].y) / 2;
            ctrlPts.push(points[i].x, points[i].y, xc, yc);
        }
        return ctrlPts;
    },

    // reference:
    // http://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
    _quadraticCurve: function (ctx, points) {

        if (points.length <= 2) {
            Z.Canvas._path(ctx, points);
            return;
        }
        var xc = (points[0].x + points[1].x) / 2,
            yc = (points[0].y + points[1].y) / 2;
        ctx.lineTo(xc, yc);
        var ctrlPts = this._getQuadCurvePoints(points);
        var i, len = ctrlPts.length;
        for (i = 0; i < len; i += 4) {
            ctx.quadraticCurveTo(ctrlPts[i], ctrlPts[i + 1], ctrlPts[i + 2], ctrlPts[i + 3]);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    },

    _getCubicCurvePoints: function (points) {
        var ctrlPts = [];
        var f = 0.3;
        var t = 0.6;

        var m = 0;
        var dx1 = 0;
        var dy1 = 0;
        var dx2, dy2;
        var curP, nexP;
        var preP = points[0];
        for (var i = 1, len = points.length; i < len; i++) {
            curP = points[i];
            nexP = points[i + 1];
            if (nexP) {
                m = (nexP.y - preP.y) / (nexP.x - preP.x);
                dx2 = (nexP.x - curP.x) * -f;
                dy2 = dx2 * m * t;
            } else {
                dx2 = 0;
                dy2 = 0;
            }
            // ctx.bezierCurveTo(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
            ctrlPts.push(preP.x - dx1, preP.y - dy1, curP.x + dx2, curP.y + dy2, curP.x, curP.y);
            dx1 = dx2;
            dy1 = dy2;
            preP = curP;
        }
        return ctrlPts;
    },

    _bezierCurve: function (ctx, points) {

        if (points.length <= 2) {
            Z.Canvas._path(ctx, points);
            return;
        }
        var ctrlPts = this._getCubicCurvePoints(points);
        var i, len = ctrlPts.length;
        for (i = 0; i < len; i += 6) {
            ctx.bezierCurveTo(ctrlPts[i], ctrlPts[i + 1], ctrlPts[i + 2], ctrlPts[i + 3], ctrlPts[i + 4], ctrlPts[i + 5]);
        }
    }
});
