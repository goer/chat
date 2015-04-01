'use strict';

var app = angular.module('chat',[]);

app.factory('socket', function($rootScope) { 
	var socket = io.connect('chat-fonetix.rhcloud.com:8000');
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

app.controller('MainCtrl',function($scope,socket){

	$scope.messages = [];

	socket.on('message',function(data){
		console.log(data);
		$scope.messages.push(data);
	});

	$scope.sendMessage = function(){
		socket.emit('send', {message : $scope.message });	
		console.log('message:'+$scope.message);
	};


});

