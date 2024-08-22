import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db=new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist_project",
  password: "yash",
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  try{
    const result=await db.query("select * from items ");
    items=result.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  }catch(err){
    console.log(err);
  }
  
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try{
    await db.query("Insert into items (title) values ($1) ",[item]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  const title=req.body.updatedItemTitle;
  const id=req.body.updatedItemId;
  try{
    await db.query("update items set title= ($1) where id= $2", [title,id]);
    res.redirect("/");
}catch(err){
  console.log(err);
}
});

app.post("/delete", async(req, res) => {
  const id=req.body.deleteItemId;

  try{
    await db.query("DELETE FROM items where id==$1",[id]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
