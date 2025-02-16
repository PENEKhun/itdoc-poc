import knexConfig from "./knexfile.js";
import { Model } from "objection";
import Knex from "knex";

let dbConfig = knexConfig[process.env.NODE_ENV];
const knex = Knex(dbConfig);

Model.knex(knex);
