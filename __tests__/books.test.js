const db = require("../db");
const request = require("supertest");
const app = require("../app");

const Book = require("../models/book");

process.env.NODE_ENV = "test"

describe("Test Book class", function () {
    beforeEach(async function () {
        await db.query("DELETE FROM books");
        let b = await Book.create({
            isbn: "0691161534",
            amazon_url: "http://a.co/eobPtX2",
            author: "Test Author",
            language: "english",
            pages: 264,
            publisher: "Test Publisher",
            title: "Test Book",
            year: 2015
        });
    })

    describe("Test CRUD operations", function () {
        test("can add a book", async function () {
            let response = await request(app)
                .post("/books/")
                .send({
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Matthew Lane",
                    language: "english",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    year: 2017
                });
                expect(response.statusCode).toEqual(201);
        });
        test("can't add a book without all fields", async function () {
            let response = await request(app)
                .post("/books/")
                .send({
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Matthew Lane",
                    language: "english",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games"
                });
                expect(response.statusCode).toEqual(400);
        });
        test("can update a book", async function () {
            let response = await request(app)
                .put("/books/0691161534")
                .send({
                    isbn: "0691161534",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Test Author",
                    language: "spanish",
                    pages: 264,
                    publisher: "Test Publisher",
                    title: "Test Book",
                    year: 2017
                });
                expect(response.statusCode).toEqual(200);
        });
        test("can't update a book without all fields", async function () {
            let response = await request(app)
                .put("/books/0691161534")
                .send({
                    isbn: "0691161534",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Test Author",
                    language: "spanish",
                    pages: 264,
                    publisher: "Test Publisher",
                    year: 2017
                });
                expect(response.statusCode).toEqual(400);
        });
        test("can get all books", async function() {
            let response = await request(app)
            .get("/books")
            expect(response.statusCode).toEqual(200);
        })
        test("can get one book", async function() {
            let response = await request(app)
            .get("/books/0691161534")
            expect(response.statusCode).toEqual(200);
        })
        test("can't get a book with the wrong isbn", async function() {
            let response = await request(app)
            .get("/books/0691161535")
            expect(response.statusCode).toEqual(404);
        })
        test("can delete a book", async function() {
            let response = await request(app)
                .delete("/books/0691161534")
                expect(response.statusCode).toEqual(200);
        });
    })
})

afterAll(async function () {
    await db.end();
});
