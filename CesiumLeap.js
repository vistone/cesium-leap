/*global define */

/**
 */
define(function (require) {
    'use strict';
    var Leap = require('Leap');
    var version = "0.0.1";

	var CesiumLeap = function(options){
		var cesiumLeap = this;
		this.version = version;		
		this.ellipsoid = options.ellipsoid;
		this.scene = options.scene;
		this.leapController = new Leap.Controller();
		this.leapController.on('connect', function(){
			cesiumLeap.onConnect.apply(cesiumLeap,arguments);
		});
		this.leapController.on('frame', function(data){
			cesiumLeap.onFrame(data);
		});

	}

	CesiumLeap.prototype.onConnect = function(){
		console.log('successfully connected with leap controller!');
	}

	CesiumLeap.prototype.onFrame = function(data){
		var data = frame.data;
		if (frame.valid && data.hands.length === 1) {
		    var fingers = data.pointables;
		    if (fingers.length > 1) {
		        data = data.hands[0];
		        if (data.timeVisible > 0.75) {
		            var cesiumLeap = this,
		                camera = cesiumLeap.scene.getCamera(),
		                cameraController = camera.controller,
		                movement = {},
		                cameraHeight = controller.ellipsoid.cartesianToCartographic(camera.position).height,
		                moveRate = cameraHeight / 100.0;

		            // pan - x,y
		            movement.x = data.palmPosition[0];
		            movement.y = data.palmPosition[2];

		            //zoom - z // height above leap
		            movement.z = data.palmPosition[1];

		            //pitch - pitch
		            var normal = data.palmNormal;
		            movement.pitch = -1 * normal[2]; // leap motion has it that negative is sloping upwards, flipping it for google earth
		            //Math.atan2(normal.z, normal.y) * 180/math.pi + 180;
		            movement.rotate = data.direction[0];
		            //yaw - yaw
		            movement.yaw = -1 * normal[0]; // roll?
		            // LeapMotion flips its roll angles as well

		            // this 'mid' var seems to be a natural mid point in the 'z'
		            // (or vertcal distance above device)
		            // direction that is used for whether you are closer to the  device
		            // or away from it.
		            var mid = 175;
		            var normalized = (movement.z - mid) / -100;

		            cameraController.moveForward(normalized * moveRate);
		            cameraController.moveRight(movement.x * moveRate / 100);
		            cameraController.moveDown(movement.y * moveRate / 100);

		            cameraController.lookUp(movement.pitch / 100);

		            cameraController.twistRight(movement.yaw / 100);
		            cameraController.lookRight(movement.rotate / 100);
		        }
		    }
		}

	}
	return CesiumLeap;

});
