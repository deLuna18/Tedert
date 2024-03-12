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
	
	// MY LOGIN
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
				
				// MY LOGOUT
				$scope.logout = function(){
					var confirmLogout = confirm("Are you sure you want to logout?");
					if (confirmLogout) { 
						$rootScope.logged = false;
						$location.path("/");
						$rootScope.message = " ";  
					}
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
				$http({
					'url': '/studentlist',
					'method': 'get'
				}).then(function (response) {
					$scope.slist = response.data;
					$scope.header = Object.keys($scope.slist[0]);
					$scope.generatePageButtons();
				});

				// FUNCTION TO CALCULATE NUMBER OF PAGES
				$scope.numberOfPages = function(){
					return Math.ceil($scope.slist.length/$scope.pageSize);
				}
				
				
				//  $scope.showingEntries = function () {
				// 	var start = $scope.currentPage * $scope.pageSize + 1;
				// 	var end = Math.min((($scope.currentPage + 1) * $scope.pageSize), $scope.totalEntries);
				// 	return "Showing " + start + " to " + end + " of " + $scope.totalEntries + " entries";
				// }

				$scope.changePage = function (pageIndex) {
					var totalPages = $scope.numberOfPages();
			
					if (pageIndex >= 0 && pageIndex < totalPages && pageIndex !== $scope.currentPage) {
						$scope.currentPage = pageIndex;
						$scope.generatePageButtons();
					}
				};

				$scope.setPageSize = function (size) {
					$scope.pageSize = size;
					$scope.currentPage = 0; 
					$scope.generatePageButtons(); 
				};

				$scope.modalcontrol = function(modalname,control){
					document.getElementById(modalname).style.display=control;
				}
				
				// BUTTONS AT THE BUTTOM 1 , 2 ,3 ,4 ,5 ,6 ,7 
				$scope.generatePageButtons = function () {
					$scope.pageButtons = [];
					var totalPages = $scope.numberOfPages();
					var maxButtons = 7; 
				
					
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
				
					
					for (var i = startPage; i <= endPage; i++) {
						$scope.pageButtons.push(i);
					}
				};

				// FOR CHANGES IN PAGE SIZE
				$scope.$watch('pageSize', function(newPageSize, oldPageSize) {
					if (newPageSize !== oldPageSize) {
						$scope.currentPage = 0;
						$scope.generatePageButtons();
					}
				});
				
				// FOR SAVE BUTTON 
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
						console.log(response.data); 
						$scope.idno = '';
						$scope.lastname = '';
						$scope.firstname = '';
						$scope.course = '';
						$scope.level = '';
						$scope.modalcontrol('studentmodal', 'none');
						$http({
							'url': '/studentlist',
							'method': 'get'
						}).then(function(response) {
							$scope.slist = response.data;
							$scope.totalEntries = $scope.slist.length;
							$scope.currentPage = Math.min($scope.currentPage, $scope.numberOfPages() - 1);
							$scope.generatePageButtons();
						}).catch(function(error) {
							console.error("Error fetching updated student list:", error);
						});
					}).catch(function(error) {
						console.error("Error saving student:", error);
					});
				}
				
				// SORTING ASCENDING ORDER AND DESCENDING ORDER
				$scope.sortBy = function(column) {
					if ($scope.sortColumn === column) {
						$scope.reverseSort = !$scope.reverseSort;
					} else {
						$scope.sortColumn = column;
						$scope.reverseSort = false;
					}
					
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
							
							break;
					}
				};

				//EDIT 
				$scope.editStudent = function(student) {
					$scope.editingStudent = angular.copy(student);
					$scope.modalcontrol('editStudentModal', 'block');
					$scope.editingStudent.courses = $scope.courses;
					$scope.idno = $scope.editingStudent.idno;
				};
				
				// UPDATE THE TABLE ONCE THE USER EDIT THE INFORMATION
				$scope.updateStudent = function() {
					$scope.editingStudent.idno = $scope.idno; 
					$http({
						'url': '/updatestudent',
						'method': 'post',
						'data': $scope.editingStudent
					}).then(function(response) {
						var index = $scope.slist.findIndex(student => student.idno === $scope.editingStudent.idno);
						if (index !== -1) {
							$scope.slist[index] = angular.copy($scope.editingStudent);
							$scope.slist[index].idno = $scope.idno; 
						}
						$scope.modalcontrol('editStudentModal', 'none');
					}).catch(function(error) {
						console.error("Error:", error);
					});
				};

				//DELETE
				$scope.deleteStudent = function(student) {
					var confirmDelete = confirm("Are you sure you want to delete this student?");
					if (confirmDelete) {
						$http({
							'url': '/deletestudent',
							'method': 'post',
							'data': student
						}).then(function(response) {
							$scope.slist = $scope.slist.filter(s => s.idno !== student.idno);
						}).catch(function(error) {
							console.error("Error deleting student:", error);
						});
					}
				};

			});

			// FILTER 
			app.filter("startFrom",function(){
				return function(input,start){
					start =+ start;
				return input.slice(start);
				};
			});