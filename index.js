const express = require("express")
const fs = require("fs")
const ejs = require("ejs")


const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: "16Kb" }))


app.post("/createUser", (req, res) => {
    try {
        const { userName, email} = req.body
        if (!userName || !email) {
            return res.render("createUsers.ejs", { message: "All fields are required!" })
        }

        const users = require("./users.json")

        const newUser = {
            userName: userName,
            email: email
        }

        for (const index in users) {
            if (users[index].userName.toLowerCase() == userName.toLowerCase() || users[index].email.toLowerCase() == email.toLowerCase()) {
                return res.render("createUsers.ejs", { message: "There is already a user with same credentials!" })
            }
        }

        users.push(newUser)

        fs.writeFileSync(
            "./users.json",
            JSON.stringify(users),
            error => {
                if (error) throw error;
            }
        )

        return res.render("createUsers.ejs", { message: "User Registered!" })

    } catch (error) {
        return res.render("createUsers.ejs", { message: "Something went wrong!" })
    }
})

app.post("/editUser", (req, res) => {
    const { newName, email} = req.body
    if (!email && newName.length() < 1) {
        return res.render("editUserPage.ejs", { message: "All fields are required!" })
    }

    let updated = false;
    const users = require("./users.json")

    for (const index in users) {
        if (users[index].userName == newName) {
            return res.render("editUserPage.ejs", { message: "There is a user with same name, please try again with another username" })
        }
    }

    for (const index in users) {
        if (users[index].email == email) {

            if (newName.length == 0) {
                return res.render("editUserPage.ejs", { message: "Please Enter new username!" })
            }
            users[index].userName = newName
            
            updated = true;
        }
    }

    if (!updated) {
        return res.render("editUserPage.ejs", { message: "No user with provided email!" })
    }

    fs.writeFileSync(
        "./users.json",
        JSON.stringify(users),
        error => {
            if (error) {
                throw error
            }
        }
    )

    return res.render("editUserPage.ejs", { message: "User updated successfully!" })
})

app.get("/users", (req, res) => {
    const users = require("./users.json")
    return res.render("users.ejs", { users: users })
})

app.get("/", (req, res) => {
    return res.render("createUsers.ejs", { message: "" })
})
app.get("/editUserPage", (req, res) => {
    return res.render("editUserPage.ejs", { message: "" })
})


// app.get("/sameUsername", (req, res) => {
//     const userName = req.body
//     const users = require("./users.json")
//     let isUserNameSame = false;
//     for (const index in users) {
//         if (users[index].userName == userName) {
//             isUserNameSame = true
//         }
//     }
//     if (isUserNameSame) {
//         return res.
//     }
// })

app.listen(3030, () => {
    console.log("Server is listening on port 3030")
})
