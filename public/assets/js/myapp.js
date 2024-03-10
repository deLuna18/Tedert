	//using the es5
	var app = angular.module("myapp", ["ngRoute"]);

	app.config(function($routeProvider) {
		$routeProvider
			.when("/", {
				templateUrl: 'login.html',
				controller: 'loginController'
			})
			.when("/main", {
				templateUrl: 'main.html',
				controller: 'mainController',
				resolve: {
					'check': function($rootScope, $location) {
						if (!$rootScope.logged) {
							$location.path("/");
						}
					}
				}
			})
			.otherwise({ redirectTo: '/' });
	});
	
	app.controller("loginController", function($scope, $location, $rootScope, $http) {
		$scope.login = function() {
			var uname = $scope.username;
			var pword = $scope.password;
			$http.post("/login", { username: uname, password: pword })
				.then(function(response) {
					$rootScope.logged = true;
					$rootScope.message = "Login successful!";
					$location.path("/main"); 
				})
				.catch(function(error) {
					$rootScope.logged = false;
					$rootScope.message = "Invalid username or password";
					console.error("Login failed:", error);
				});
		};
	});
		
			app.controller("mainController",function($scope,$http,$rootScope,$location){
				$scope.pagesizes=[5,10,15,20];
				$scope.pageSize=5;
				$scope.currentPage = 0
				$scope.pageButtons = [];
				
				$scope.logout = function(){
					$rootScope.logged = false;
					$location.path("/");
					$rootScope.message = " "; //LOGOUT
				}
				
				$scope.courses= [
					{'courseid':'bsit','coursename':'information technology'},
					{'courseid':'bscs','coursename':'computer science'},
					{'courseid':'bsis','coursename':'information systems'},
					{'courseid':'bsim','coursename':'information management'},
					{'courseid':'act','coursename':'computer technology'},
				];
				
				$scope.levels = [
					{'levelid':'1','levelname':'1st year'},
					{'levelid':'2','levelname':'2nd year'},
					{'levelid':'3','levelname':'3rd year'},
					{'levelid':'4','levelname':'4th year'},
				];
				//create a function to retrieve the data from app.js
				$http({
					'url': '/studentlist',
					'method': 'get'
				}).then(function (response) {
					$scope.slist = response.data;
					$scope.header = Object.keys($scope.slist[0]);
					// Initialize page buttons
					$scope.generatePageButtons();
				});
				$scope.numberOfPages = function(){
					return Math.ceil($scope.slist.length/$scope.pageSize);
				}
				
				 // Show entries range message
				 $scope.showingEntries = function () {
					var start = $scope.currentPage * $scope.pageSize + 1;
					var end = Math.min((($scope.currentPage + 1) * $scope.pageSize), $scope.totalEntries);
					return "Showing " + start + " to " + end + " of " + $scope.totalEntries + " entries";
				}

				$scope.changePage = function (pageIndex) {
					// Calculate the total number of pages
					var totalPages = $scope.numberOfPages();
			
					// Check if the requested page index is within bounds
					if (pageIndex >= 0 && pageIndex < totalPages && pageIndex !== $scope.currentPage) {
						// Update the current page
						$scope.currentPage = pageIndex;
						// Regenerate page buttons based on new current page
						$scope.generatePageButtons();
					}
				};

				$scope.setPageSize = function (size) {
					$scope.pageSize = size;
					$scope.currentPage = 0; // Reset to first page when changing page size
					$scope.generatePageButtons(); // Regenerate page buttons based on new page size
				};

				$scope.modalcontrol = function(modalname,control){
					document.getElementById(modalname).style.display=control;
				}
				
				$scope.generatePageButtons = function () {
					$scope.pageButtons = [];
					var totalPages = $scope.numberOfPages();
					var maxButtons = 7; // Maximum number of buttons to display
				
					// Determine the number of buttons to display
					var startPage = 1;
					var endPage = totalPages;
					if (totalPages > maxButtons) {
						var middleIndex = Math.floor(maxButtons / 2);
						if ($scope.currentPage >= middleIndex && $scope.currentPage < totalPages - middleIndex) {
							startPage = $scope.currentPage - middleIndex + 1;
							endPage = $scope.currentPage + middleIndex;
						} else if ($scope.currentPage >= totalPages - middleIndex) {
							startPage = totalPages - maxButtons + 1;
							endPage = totalPages;
						}
					}
				
					// Generate the page buttons
					for (var i = startPage; i <= endPage; i++) {
						$scope.pageButtons.push(i);
					}
				};
				
				$scope.$watch('pageSize', function(newPageSize, oldPageSize) {
					if (newPageSize !== oldPageSize) {
						$scope.currentPage = 0; // Reset to first page when changing page size
						$scope.generatePageButtons();
					}
				});
				
				$scope.savestudent = function() {
					$http({
						'url': '/savestudent',
						'method': 'post',
						'data': {
							'idno': $scope.idno,
							'lastname': $scope.lastname,
							'firstname': $scope.firstname,
							'course': $scope.course,
							'level': $scope.level,
						}
					}).then(function(response) {
						console.log(response.data); // Log the response data to see if it's successful
						// Clear input fields after saving
						$scope.idno = '';
						$scope.lastname = '';
						$scope.firstname = '';
						$scope.course = '';
						$scope.level = '';
						// Close the modal
						$scope.modalcontrol('studentmodal', 'none');
						// Fetch the updated student list
						$http({
							'url': '/studentlist',
							'method': 'get'
						}).then(function(response) {
							$scope.slist = response.data;
							// Update total number of entries
							$scope.totalEntries = $scope.slist.length;
							// Recalculate current page
							$scope.currentPage = Math.min($scope.currentPage, $scope.numberOfPages() - 1);
							// Update page buttons and other necessary elements
							$scope.generatePageButtons();
						}).catch(function(error) {
							console.error("Error fetching updated student list:", error);
						});
					}).catch(function(error) {
						console.error("Error saving student:", error);
					});
				}
				
				$scope.sortBy = function(column) {
					if ($scope.sortColumn === column) {
						$scope.reverseSort = !$scope.reverseSort;
					} else {
						$scope.sortColumn = column;
						$scope.reverseSort = false;
					}
					// Implement custom sorting logic based on the column
					switch (column) {
						case 'lastname':
							$scope.slist.sort(function(a, b) {
								if ($scope.reverseSort) {
									return b.lastname.localeCompare(a.lastname);
								} else {
									return a.lastname.localeCompare(b.lastname);
								}
							});
							break;
						case 'firstname':
							$scope.slist.sort(function(a, b) {
								if ($scope.reverseSort) {
									return b.firstname.localeCompare(a.firstname);
								} else {
									return a.firstname.localeCompare(b.firstname);
								}
							});
							break;
						case 'course':
							$scope.slist.sort(function(a, b) {
								if ($scope.reverseSort) {
									return b.course.localeCompare(a.course);
								} else {
									return a.course.localeCompare(b.course);
								}
							});
							break;
						case 'level':
							$scope.slist.sort(function(a, b) {
								if ($scope.reverseSort) {
									return b.level.localeCompare(a.level);
								} else {
									return a.level.localeCompare(b.level);
								}
							});
							break;
						case 'idno':
							$scope.slist.sort(function(a, b) {
								if ($scope.reverseSort) {
									return b.idno - a.idno;
								} else {
									return a.idno - b.idno;
								}
							});
							break;
						default:
							// Do nothing if column is not recognized
							break;
					}
				};
			});
			//
			app.filter("startFrom",function(){
				return function(input,start){
					start =+ start;
				return input.slice(start);
				};
			});