import axios from "axios";
import { Lecture } from "../types";
import { createCachedFetcher } from "./utils";

export const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json');
export const cachedFetchMajors = createCachedFetcher(fetchMajors);

export const fetchLiberalArts = () => axios.get<Lecture[]>('/schedules-liberal-arts.json');
export const cachedFetchLiberalArts = createCachedFetcher(fetchLiberalArts);
