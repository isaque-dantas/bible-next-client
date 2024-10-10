'use client';

import {useMemo, useState} from "react";
import Selector from "@/app/read/selector";
import {Chapter, CompleteBook, Version} from "@/app/read/interfaces";

// <BibleContent
//     selectedVersion={selectedVersion}
//     selectedBoook={selectedBook}
//     selectedChapter={selectedChapter}
//     versions={versions}
//     books={books}
// />

interface Props {
    selectedVersion: Version;
    selectedBook: CompleteBook;
    versions: Version[];
    books: CompleteBook[];
    selectedChapter: Chapter;
}

export default function BibleContent({selectedBook, selectedChapter, versions, books}: Props) {

    function updateParsedContent(changing: { value: string | number, propertyName: string }) {
        // setSelectedChapter("");
    }

    console.log(selectedChapter)

    const parsedContent = selectedChapter.verses.map(
        (verse, i) => <p key={i}><em className="pe-2 text-cyan-600">{verse.number}</em>{verse.text}</p>
    )

    return (
        <div className="flex flex-col">
            <Selector
                onChange={updateParsedContent}
                chaptersAmount={selectedBook.chapters}
                versions={versions}
                books={books}
            />
            <section className="mt-4 flex flex-col gap-2 max-h-[75vh] overflow-y-scroll">
                {parsedContent}
            </section>
        </div>
    )
}