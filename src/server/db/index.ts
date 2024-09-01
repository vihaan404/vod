import { drizzle } from "drizzle-orm/postgres-js";
import {sql} from "@vercel/postgres"
import * as schema from "./schema";


// @ts-ignore
export const db = drizzle(sql, { schema });
