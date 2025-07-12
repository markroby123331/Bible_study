// Load environment variables
require('dotenv').config();

const express = require("express");
const session = require("express-session");
const multer = require("multer");
const app = express();
const db = require("./config/database");
const moment = require("moment-timezone");
const nodemailer = require('nodemailer');

// const Event = require('./models/transactions.js');
const Event1 = require("./models/student_data.js");
const Event2 = require("./models/log_student.js");
const Event4 = require("./models/points_value.js");


const EventUserStatus = require("./models/user_status.js");
const EventUserLogin = require("./models/user_login.js");

const ejs = require("ejs");
const { Int32 } = require("mongodb");
const { result, isEmpty, parseInt } = require("lodash");
const { contains, event, data } = require("jquery");
const os = require("os");

app.set("view engine", "ejs");

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Use environment variable
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
  })
);

// Server Run
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

app.use(express.static(__dirname + "/views"));
app.use(express.static("public"));
app.use(express.static("files"));
app.use(express.static("routes"));
app.use(express.static("node_modules"));
app.use(express.urlencoded({ extended: true }));

// Middleware to check if user is logged in
function checkAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

app.get("/home", checkAuthenticated, (req, res) => {
  console.log("Home Get");

  const user = req.session.user;

  EventUserStatus.find(
    { status: 1, user: user.username },
    (err, check_session) => {
      if (check_session.length == 0) {
        res.redirect("/login");
      } else {
        res.render("events/index", {
          user_data: check_session[0],
        });
      }
    }
  );
});

app.post("/home", (req, res) => {
  console.log("Home Post");

  const user = req.session.user;
  const computerName = os.hostname();
  const type = os.type();
  const dir = os.userInfo().homedir;
  // لحد ما نحل المشكلة بتاعت الـ Time Out
  EventUserStatus.updateOne(
    { status: 1, user: user.username },
    { $set: { status: 0, logout_time: Date.now() } }
  ).then((result) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/home");
      }
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });
});

app.get("/", (req, res) => {
  console.log("/ Get");

  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  console.log("Login Get");

  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.render("events/login", { pass: 1 });
  }
});

app.post("/login", (req, res) => {
  console.log("Login Post");
  const computerName = os.hostname();
  const type = os.type();
  const dir = os.userInfo().homedir;

  // Check if this is a logout request
  if (req.body.logout_input) {
    const username = req.body.logout_input;

    EventUserStatus.updateOne(
      { status: 1, user: username },
      { $set: { status: 0, logout_time: Date.now() } }
    )
      .then(() => {
        req.session.destroy((err) => {
          if (err) {
            console.error(err);
            return res.redirect("/home");
          }
          res.clearCookie("connect.sid");
          res.redirect("/home");
        });
      })
      .catch((err) => {
        console.error(err);
        res.redirect("/home");
      });
    return;
  }

  const usernameUp = req.body.username_up;
  const passwordUp = req.body.Password_up;

  if (!usernameUp || !passwordUp) {
    return res.render("events/login", { pass: 2, username: null });
  }

  EventUserLogin.find({ user_name: usernameUp }, (err, session) => {
    if (err) {
      console.error(err);
      return res.render("events/login", { pass: 2, username: null });
    }

    if (session.length === 1) {
      if (session[0].password === passwordUp) {
        EventUserStatus.find(
          { user: usernameUp, status: 1 },
          (err, checkSession) => {
            if (err) {
              console.error(err);
              return res.render("events/login", { pass: 2, username: null });
            }

            if (checkSession.length === 0) {
              req.session.user = {
                username: usernameUp,
                privilege: session[0].privilege,
              };

              let newEventUserStatus = new EventUserStatus({
                user: usernameUp,
                status: 1,
                login_time: Date.now(),
                logout_time: null,
                computer_name: os.hostname(),
                homedir: os.userInfo().homedir,
                type: os.type(),
                privilege: session[0].privilege,
              });

              newEventUserStatus
                .save()
                .then(() => res.redirect("/home"))
                .catch((err) => {
                  console.error(err);
                  res.render("events/login", { pass: 2, username: null });
                });
            } else {
              res.render("events/login", { pass: 3, username: usernameUp });
            }
          }
        );
      } else {
        res.render("events/login", { pass: 0, username: null });
      }
    } else {
      res.render("events/login", { pass: 2, username: null });
    }
  });
});

// ========================= ranking =========================================================================================================
// ========================= ranking =========================================================================================================
// ========================= ranking =========================================================================================================
// ========================= ranking =========================================================================================================

app.get("/ranking", async (req, res) => {
  console.log("ranking Get");

  try {
    const results = await Event2.aggregate([
      {
        $group: {
          _id: "$student_number",
          student_name: { $first: "$student_name" },
          attendance: {
            $sum: {
              $convert: {
                input: "$student_attendance",
                to: "int",
                onError: 0,
                onNull: 0
              }
            }
          },
          bible_church: {
            $sum: {
              $convert: {
                input: "$student_bible_church",
                to: "int",
                onError: 0,
                onNull: 0
              }
            }
          },
          bible: {
            $sum: {
              $convert: {
                input: "$student_bible",
                to: "int",
                onError: 0,
                onNull: 0
              }
            }
          },
          without_bible: {
            $sum: {
              $convert: {
                input: "$student_without_bible",
                to: "int",
                onError: 0,
                onNull: 0
              }
            }
          },
          task: {
            $sum: {
              $convert: {
                input: "$student_Task",
                to: "int",
                onError: 0,
                onNull: 0
              }
            }
          },
          friend: {
            $sum: {
              $convert: {
                input: "$student_Friend",
                to: "int",
                onError: 0,
                onNull: 0
              }
            }
          },
          contest: {
            $sum: {
              $convert: {
                input: "$student_bonus",
                to: "int",
                onError: 0,
                onNull: 0
              }
            }
          },
          quiz: {
            $sum: {
              $convert: {
                input: "$student_quiz",
                to: "int",
                onError: 0,
                onNull: 0
              }
            }
          }
        }
      },
      {
        $addFields: {
          total: {
            $add: [
              "$attendance",
              "$bible_church",
              "$bible",
              "$without_bible",
              "$task",
              "$friend",
              "$contest",
              "$quiz"
            ]
          }
        }
      },
      { $sort: { total: -1 } },
      {
        $setWindowFields: {
          sortBy: { total: -1 },
          output: {
            rank: { $rank: {} }
          }
        }
      }
    ]);

    // 👇 Group students by their rank (1, 2, 3, etc.)
    const groupedByRank = {};
    results.forEach(student => {
      const rank = student.rank;
      if (!groupedByRank[rank]) {
        groupedByRank[rank] = [];
      }
      groupedByRank[rank].push(student);
    });

    // 👇 Send to view: all students, and podium ranks
    res.render("events/ranking", {
      students: results,
      first: groupedByRank[1] || [],
      second: groupedByRank[2] || [],
      third: groupedByRank[3] || []
    });

  } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// ========================= add_student ============================== add_student =========================================================================================================
// ========================= add_student ============================== add_student =========================================================================================================
// ========================= add_student ============================== add_student =========================================================================================================
// ========================= add_student ============================== add_student =========================================================================================================
app.get("/add_student", checkAuthenticated, (req, res) => {
  console.log("add_student Get");

  const computerName = os.hostname();
  const type = os.type();
  const dir = os.userInfo().homedir;
  const user = req.session.user;

  EventUserStatus.find(
    { status: 1, user: user.username },
    (err, check_session) => {
      if (
        check_session.length == 1 &&
        (check_session[0].privilege == "creator" ||
          check_session[0].privilege == "admin")
      ) {
        // Passing the user data to the EJS template
        res.render("events/add_student", {
          user_data: check_session[0],
        });
      } else {
        res.redirect("/forbidden");
      }
    }
  );
});

// ============== add_student Post ============== add_student Post ==============
// ============== add_student Post ============== add_student Post ==============

app.post("/add_student", (req, res) => {
  console.log("add_student Post");

  // Basic validation
  if (!req.body.name || !req.body.phone) {
    console.log("Missing required fields");
    return res.status(400).send("Name and phone are required");
  }

  let newEvent1 = new Event1({
    student_name: req.body.name,
    student_number: req.body.phone,
    student_mail: req.body.email || "",
    student_location: req.body.location || "",
    student_level: req.body.level || "",
    user_name: req.body.user_name || "",
    status: "0",
    isdeleted: "0",
  });

  newEvent1.save()
    .then(() => {
      console.log("Student added successfully");
      res.redirect("/add_student");
    })
    .catch((err) => {
      console.error("Error saving student:", err);
      res.status(500).send("Failed to save student");
    });
});

// ========================= attendance ============================== attendance =========================================================================================================
// ========================= attendance ============================== attendance =========================================================================================================
// ========================= attendance ============================== attendance =========================================================================================================
// ========================= attendance ============================== attendance =========================================================================================================
app.get("/attendance", checkAuthenticated, (req, res) => {
  console.log("attendance Get");

  const computerName = os.hostname();
  const type = os.type();
  const dir = os.userInfo().homedir;
  const user = req.session.user;

  EventUserStatus.find(
    { status: 1, user: user.username },
    (err, check_session) => {
      if (
        check_session.length == 1 &&
        (check_session[0].privilege == "creator" ||
          check_session[0].privilege == "admin")
      ) {
        // Passing the user data to the EJS template
        res.render("events/attendance", {
          user_data: check_session[0],
        });
      } else {
        res.redirect("/forbidden");
      }
    }
  );
});

// ============== attendance Post ============== attendance Post ==============
// ============== attendance Post ============== attendance Post ==============

app.post("/attendance", (req, res) => {
  console.log("📌 Attendance Post Request Received");
  console.log("Scanned QR code (phone number):", req.body.attendance_code);
  console.log("Bible Status:", req.body.bible_status); // Log the selected Bible status

  // Search for student by phone number in Event1
  Event1.findOne({ student_number: req.body.attendance_code })
    .then((student) => {
      if (!student) {
        console.log("⚠️ Student not found!");
        return res.status(404).send("Student not found!");
      }

      // Determine numerical value for Bible status
      // Determine numerical values for Bible-related fields
let student_bible = 0;
let student_bible_church = 0;
let student_without_bible = 0;

if (req.body.bible_status === "with_bible") {
  student_bible = 10;
} else if (req.body.bible_status === "from_church") {
  student_bible_church = 5;
} else if (req.body.bible_status === "without_bible") {
  student_without_bible = 0;
}


      // Create a new attendance record with retrieved student data
      let newEvent2 = new Event2({
  student_name: student.student_name,
  student_number: student.student_number,
  student_attendance: "5",
  student_quiz: student.student_quiz || "",
  student_bible: student_bible,
  student_bible_church: student_bible_church,
  student_without_bible: student_without_bible,
  student_Task: student.student_Task || "",
  student_Friend: student.student_Friend || "",
  student_bonus: student.student_bonus || "",
});


      // Save the new attendance entry
      newEvent2
        .save()
        .then(() => {
          console.log("✅ Attendance record saved successfully!");
          res.redirect("/attendance"); // Redirect after saving
        })
        .catch((err) => {
          console.error("❌ Error saving attendance:", err);
          res.status(500).send("Internal Server Error");
        });
    })
    .catch((err) => {
      console.error("❌ Error finding student:", err);
      res.status(500).send("Internal Server Error");
    });
});




// ========================= all_student ============================== all_student =========================================================================================================
// ========================= all_student ============================== all_student =========================================================================================================
// ========================= all_student ============================== all_student =========================================================================================================
// ========================= all_student ============================== all_student =========================================================================================================
app.get("/all_student", checkAuthenticated, (req, res) => {
  console.log("all_student Get");

  const computerName = os.hostname();
  const type = os.type();
  const dir = os.userInfo().homedir;
  const user = req.session.user;

  EventUserStatus.find(
    { status: 1, user: user.username },
    (err, check_session) => {
      if (
        check_session.length == 1 &&
        (check_session[0].privilege == "creator" ||
          check_session[0].privilege == "admin")
      ) {

        Event1.find({ isdeleted: "0" }).exec((err, student) => {

          res.render("events/all_student", {
            user_data: check_session[0],
            student_data: student,
          });
        });
      } else {
        res.redirect("/forbidden");
      }
    }
  );
});

// ========================= all_student ============================== all_student =========================================================================================================
// ========================= all_student ============================== all_student =========================================================================================================
// ========================= all_student ============================== all_student =========================================================================================================
// ========================= all_student ============================== all_student =========================================================================================================

const upload = multer();

app.post("/all_student", upload.single('idcard'), async (req, res) => {
  const { name, number, email } = req.body;
  const file = req.file;


   console.log("Request received");

  if (!req.file) {
    console.error("No file uploaded!");
    return res.status(400).send("No file uploaded");
  }

  console.log("File info:", req.file);
  console.log("Body:", req.body);

  if (!name || !number || !email || !file) {
    return res.status(400).send('Missing data');
  }

  console.log(`Sending ID card for ${name} (${number}) to ${email}`);

  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mm3906760@gmail.com',
    pass: 'aszp ghmh dqug txmb'
  }
});


  try {
    await transporter.sendMail({
      from: '"Sanaway Bible" <mm3906760@gmail.com>',
      to: email,
      subject: `Your Student ID Card`,
      text: `Dear ${name},

Please find attached your Student ID card.

Student Number: ${number}

Best regards,
Sanaway Bible Team`,
      attachments: [{
        filename: file.originalname,
        content: file.buffer
      }]
    });

    res.send(`ID card sent to ${email}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send email');
  }
});



// ========================= add_student_points Get ============================== add_student_points Get =========================================================================================================
// ========================= add_student_points Get ============================== add_student_points Get =========================================================================================================
// ========================= add_student_points Get ============================== add_student_points Get =========================================================================================================
// ========================= add_student_points Get ============================== add_student_points Get =========================================================================================================
app.get("/add_student_points", checkAuthenticated, (req, res) => {
  console.log("add_student_points Get");

  const computerName = os.hostname();
  const type = os.type();
  const dir = os.userInfo().homedir;
  const user = req.session.user;

  EventUserStatus.find(
    { status: 1, user: user.username },
    (err, check_session) => {
      if (
        check_session.length == 1 &&
        (check_session[0].privilege == "creator" ||
          check_session[0].privilege == "admin")
      ) {

        Event1.find({ isdeleted: "0" }).exec((err, student) => {
          Event4.findOne({ isdeleted: "0" }).exec((err, points) => {
            res.render("events/add_student_points", {
              user_data: check_session[0],
              emp: student,
              points_data: points,
            });
          });
        });
      } else {
        res.redirect("/forbidden");
      }
    }
  );
});



// ========================= add_student_points post ============================== add_student_points post =========================================================================================================
// ========================= add_student_points post ============================== add_student_points post =========================================================================================================
// ========================= add_student_points post ============================== add_student_points post =========================================================================================================
// ========================= add_student_points post ============================== add_student_points post =========================================================================================================
app.post("/add_student_points", (req, res) => {
  console.log("add_student_points post");

  const {
    student_name,
    student_phone,
    student_quiz,
    student_Task,
    student_Friend,
    student_bonus
  } = req.body;

  const newStudentPoints = new Event2({  // <-- Use capital E here
    student_name: student_name || '',
    student_number: student_phone || '',

    student_attendance: "",
    student_bible: "",
    student_bible_church: "",
    student_without_bible: "",

    // Save posted value if exists, else "0"
    student_quiz: student_quiz ? student_quiz : "0",
    student_Task: student_Task ? student_Task : "0",
    student_Friend: student_Friend ? student_Friend : "0",
    student_bonus: student_bonus ? student_bonus : "0",

    student_date: new Date().toISOString().split('T')[0]
  });

  newStudentPoints.save()
    .then(() => {
      console.log('Student points saved');
      res.redirect('/add_student_points');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error saving student points');
    });
});



// ========================= forbidden post ============================== forbidden post =========================================================================================================
// ========================= forbidden post ============================== forbidden post =========================================================================================================
// ========================= forbidden post ============================== forbidden post =========================================================================================================
// ========================= forbidden post ============================== forbidden post =========================================================================================================
app.get("/forbidden", (req, res) => {
  console.log("forbidden Get");

  const computerName = os.hostname();
  const type = os.type();
  const dir = os.userInfo().homedir;
  const user = req.session.user;

 EventUserStatus.find(
  { status: 1, user: user?.username },
  (err, check_session) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server error.");
    }

    if (
      check_session.length === 1 &&
      (check_session[0].privilege === "creator" || check_session[0].privilege === "admin")
    ) {
      // Fetch events
      Event1.find({ isdeleted: "0" }).exec((err, student) => {
        if (err) return res.status(500).send("Error fetching Event1");

        Event4.findOne({ isdeleted: "0" }).exec((err, points) => {
          if (err) return res.status(500).send("Error fetching Event4");

          res.render("events/forbidden", {
            user_data: check_session[0],
            emp: student,
            points_data: points,
          });
        });
      });
    } else {
      return res.status(403).send("forbidden");
    }
  }
);

});