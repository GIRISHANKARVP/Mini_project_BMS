const express = require('express')
const path = require("path")
const bodyParser = require('body-parser');
const { createPool } = require('mysql');
const mysql = require('mysql')
const port = 3000

const pool = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bank",
    connectionLimit: 20
})

const ejsMate = require('ejs-mate');
const { release } = require('os');

const app = express()
app.use(express.static(path.join(__dirname, "/public")))
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/account', (req, res) =>/*instead of function call use =>*/  {
    res.render('account')
})
app.get('/branch', (req, res) => {
    res.render('branch')
})
app.get('/customer', (req, res) => {
    res.render('customer')
})
//insert account*************************************************
app.post('/bank'/*by action */, (req, res) => {
   
    let {an,bi,bal} = req.body
    pool.getConnection((err, result/*DB */) => {
        if (err) console.log(err.message)
        else {
            
            var sql = `INSERT INTO account (anum,bid,balance) VALUES ('${an}','${bi}','${bal}');`
            result.query(sql, (err, rows/*RESULT*/ ) => {
                if (err) console.log(err)
                else {
                    // console.log(rows)
                   
                    result.release()           //close db
                    res.redirect('account')
                    
                }
            })
        }

    })
})
//view account************************************************

app.get('/viewaccount'/* */, (req, res) => {
    pool.getConnection((err, result) => {
        if (err) console.log(err.message)
        else {
            
            
            var sql = `select * from account;`
            result.query(sql, (err, rows) => {
                if (err) console.log(err)
                else {
                    //console.log(rows)
                    result.release()
                    res.render('viewaccount', { rows })  //rows(result) can by accessed in that rendered file

                }
            })
        }
    })
})
//delete account--------------------------------------

app.post('/deleteaccount', (req, res) => {
   // let {an} = req.body
    pool.getConnection((err, result) => {
        if (err) console.log(err.message)
        else {
          
          //  var sql = `DELETE FROM account WHERE anum='${req.body.an}'`
         var sql=`DELETE FROM account, customer USING account INNER JOIN customer ON account.anum = customer.anum  WHERE account.anum= '${req.body.an}';`;
            console.log("deleted")
            result.query(sql,(err, rows) => {
                if (err) console.log(err)
                else {
                    console.log(rows)
                    result.release()
                   // res.render('viewaccount', {rows})
                    res.redirect('viewaccount');

                }
            })
        }
    })
})

//update customer------------------------

app.post('/update', (req, res) => {
    console.log("updatse")
    pool.getConnection((err, result) => {
        if (err) console.log(err.message)
        else {
           
            console.log(req.body.an)
            var sql = `UPDATE customer SET cid=${req.body.ci},city='${req.body.c}',cname='${req.body.cn}' WHERE anum='${req.body.an}'`;
            result.query(sql, (err, rows) => {
                if (err) console.log(err)
                else {
                    console.log(rows)
                    result.release()
                    //res.render('viewcustomer', { rows })
                    res.redirect('viewcustomer')
                }
            })
        }
    })
})
//view*--------------***-*********---**********--------******-------*
app.get('/view', (req, res) => {
    pool.getConnection((err, result) => {
        if (err) console.log(err.message)
        else {
            
            
            var sql = `select * from account INNER JOIN customer on account.anum=customer.anum;`
            result.query(sql, (err, rows) => {
                if (err) console.log(err)
                else {
                    console.log(rows)
                    result.release()
                    res.render('view', { rows }) 


                }
            })
        }
    })
})
//insert customer*******************************************
app.post('/customer', (req, res) => {
   
    let {ci,an,cn,c} = req.body
    pool.getConnection((err, result) => {
        if (err) console.log(err.message)
        else {
            
            var sql = `INSERT INTO customer (cid,anum,cname,city) VALUES ('${ci}','${an}','${cn}','${c}');`
            result.query(sql, (err, rows ) => {
                if (err) console.log(err)
                else {
                   // console.log(rows)
                   
                    result.release()           
                    res.redirect('customer')
                    
                }
            })
        }

    })
})
//view customer
app.get('/viewcustomer', (req, res) => {
    pool.getConnection((err, result) => {
        if (err) console.log(err.message)
        else {
            
            var sql = `select * from customer;`
            result.query(sql, (err, rows) => {
                if (err) console.log(err)
                else {
                   // console.log(rows)
                    result.release()
                    res.render('viewcustomer', { rows })  

                }
            })
        }
    })
})
//insert branch*********************
app.post('/branch', (req, res) => {
   
    let {bi,bn,bc} = req.body
    pool.getConnection((err, result) => {
        if (err) console.log(err.message)
        else {
            
            var sql = `INSERT INTO bank_details (bid,bname,bplace) VALUES ('${bi}','${bn}','${bc}');`
            result.query(sql, (err, rows ) => {
                if (err) console.log(err)
                else {
                    //console.log(rows)
                   
                    result.release()           
                    res.redirect('branch')
                    
                }
            })
        }

    })
})

app.get('/viewbranch', (req, res) => {
    pool.getConnection((err, result) => {
        if (err) console.log(err.message)
        else {
            
            var sql = `select * from bank_details;`
            result.query(sql, (err, rows) => {
                if (err) console.log(err)
                else {
                    //console.log(rows)
                    result.release()
                    res.render('viewbranch', { rows })  

                }
            })
        }
    })
})

console.log("kkk")
app.listen(port,()=>{console.log("listening port:"+port)});