export interface Version {
    version: string;
    verses: number
}

export interface CompleteBook {
    abbrev: { [key: string]: string };
    author: string;
    chapters: number;
    group: string;
    name: string;
    testament: string;
}

export interface ResumedBook {
    abbrev: { [key: string]: string };
    author: string;
    group: string;
    name: string;
    version: string;
}

export interface Verse {
    book: ResumedBook;
    chapter: number;
    number: number;
    text: string;
}

export interface Chapter {
    book: ResumedBook;
    chapter: { number: number; verses: number };
    verses: [{ number: number, text: string }];
}
