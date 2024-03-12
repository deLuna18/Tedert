const express = require("express");
const path = require("path");

const app = express();

const users = [
    { 'username': 'user@uc.com', 'password': '12345' },
    { 'username': 'alexadeluna', 'password': 'de121803' },
    { 'username': 'alexa', 'password': 'deluna' }
];

const slist = [
{'idno':'0001','lastname':'durano','firstname':'dennis','course':'bscpe','level':'4'},
{'idno':'0002','lastname':'alpha','firstname':'alpha','course':'bscs','level':'2'},
{'idno':'0003','lastname':'zulu','firstname':'bravo','course':'bsit','level':'3'},
{'idno':'0004','lastname':'lima','firstname':'charlie','course':'bsit','level':'3'},
{'idno':'0005','lastname':'bravo','firstname':'delta','course':'bsis','level':'2'},
{'idno':'0006','lastname':'charlie','firstname':'echo','course':'bscs','level':'1'},
{'idno':'0007','lastname':'echo','firstname':'foxtrot','course':'bsit','level':'1'},
{'idno':'0008','lastname':'durano','firstname':'dennis','course':'bscpe','level':'4'},
{'idno':'0009','lastname':'alpha','firstname':'alpha','course':'bscs','level':'2'},
{'idno':'0010','lastname':'zulu','firstname':'bravo','course':'bsit','level':'3'},
{'idno':'0011','lastname':'lima','firstname':'charlie','course':'bsit','level':'3'},
{'idno':'0012','lastname':'bravo','firstname':'delta','course':'bsis','level':'2'},
{'idno':'0013','lastname':'charlie','firstname':'echo','course':'bscs','level':'1'},
{'idno':'0014','lastname':'echo','firstname':'foxtrot','course':'bsit','level':'1'},
{'idno':'0015','lastname':'durano','firstname':'dennis','course':'bscpe','level':'4'},
{'idno':'0016','lastname':'alpha','firstname':'alpha','course':'bscs','level':'2'},
{'idno':'0017','lastname':'zulu','firstname':'bravo','course':'bsit','level':'3'},
{'idno':'0018','lastname':'lima','firstname':'charlie','course':'bsit','level':'3'},
{'idno':'0019','lastname':'bravo','firstname':'delta','course':'bsis','level':'2'},
{'idno':'0020','lastname':'charlie','firstname':'echo','course':'bscs','level':'1'},
{'idno':'0021','lastname':'echo','firstname':'foxtrot','course':'bsit','level':'1'},
{'idno':'0022','lastname':'durano','firstname':'dennis','course':'bscpe','level':'4'},
{'idno':'0023','lastname':'alpha','firstname':'alpha','course':'bscs','level':'2'},
{'idno':'0024','lastname':'zulu','firstname':'bravo','course':'bsit','level':'3'},
{'idno':'0025','lastname':'lima','firstname':'charlie','course':'bsit','level':'3'},
{'idno':'0026','lastname':'bravo','firstname':'delta','course':'bsis','level':'2'},
{'idno':'0027','lastname':'charlie','firstname':'echo','course':'bscs','level':'1'},
{'idno':'0028','lastname':'echo','firstname':'foxtrot','course':'bsit','level':'1'},
{'idno':'0029','lastname':'durano','firstname':'dennis','course':'bscpe','level':'4'},
{'idno':'0030','lastname':'alpha','firstname':'alpha','course':'bscs','level':'2'},
{'idno':'0031','lastname':'zulu','firstname':'bravo','course':'bsit','level':'3'},
{'idno':'0032','lastname':'lima','firstname':'charlie','course':'bsit','level':'3'},
{'idno':'0033','lastname':'bravo','firstname':'delta','course':'bsis','level':'2'},
{'idno':'0034','lastname':'charlie','firstname':'echo','course':'bscs','level':'1'},
{'idno':'0035','lastname':'echo','firstname':'foxtrot','course':'bsit','level':'1'},
];

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({"extended":true}));
app.use(express.json());

app.get("/studentlist",(req,res)=>{
	res.status(200).send(slist);
});

//LOGIN
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.status(200).send("Login successful!");
    } else {
        res.status(401).send("Invalid username or password");
    }
});

//SAVE
app.post("/savestudent",(req,res)=>{
	let idno = req.body.idno;
	let lastname = req.body.lastname;
	let firstname = req.body.firstname;
	let course = req.body.course;
	let level = req.body.level;
	slist.push({
		'idno':idno,
		'lastname':lastname,
		'firstname':firstname,
		'course':course,
		'level':level,
	});
	res.status(200).send({'message':'New Student Added'});
});

//DELETE
app.post("/deletestudent", (req, res) => {
    const idno = req.body.idno; 
    const index = slist.findIndex(student => student.idno === idno);
    if (index !== -1) {
        slist.splice(index, 1); 
        res.status(200).send({ message: "Student deleted successfully" });
    } else {
        res.status(404).send({ message: "Student not found" });
    }
});


//UPDATE
app.post("/updatestudent", (req, res) => {
    const updatedStudent = req.body;
    const index = slist.findIndex(student => student.idno === updatedStudent.idno);
    if (index !== -1) {
        slist[index] = updatedStudent; 
        res.status(200).send({ message: "Student updated successfully", updatedStudent: updatedStudent }); 
    } else {
        res.status(404).send({ message: "Student not found" });
    }
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen("4321",()=>{
	console.log("listening at port 4321");
});