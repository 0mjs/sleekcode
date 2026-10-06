// Runs every case in cases.json (the examples plus hidden edge and random cases) and a speed check.
import { suite } from "../../lib/testing";
import cases from "./cases.json";
import * as solution from "./solution";

suite(cases, solution, import.meta.path);
