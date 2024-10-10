"use client";

import BibleContent from "@/app/read/bible-content";
import {Chapter, CompleteBook, Version} from "@/app/read/interfaces";
import {useState} from "react";

export default function Page() {
    const [selectedVersion, setSelectedVersion] = useState<Version>()
    const [selectedBook, setSelectedBook] = useState<CompleteBook>()
    const [selectedChapter, setSelectedChapter] = useState<Chapter>()

    function updateSelection(versionName: string, bookName: string, chapterNumber: number) {
        fetch("https://www.abibliadigital.com.br/api/versions")
            .then(res => res.json())
            .then((versions: Version[]) => {
                const versionToSelect = versions.filter(version => version.version === versionName)[0]
                setSelectedVersion(versionToSelect)
            })

        fetch("https://www.abibliadigital.com.br/api/books")
            .then(res => res.json())
            .then(books => setSelectedBook(books[0]))

        fetch(`https://www.abibliadigital.com.br/api/verses/${selectedVersion?.version}/${selectedBook?.abbrev.en}/1`)
            .then(res => res.json())
            .then(chapter => setSelectedChapter(chapter))
    }


    return (
        <div className="my-20 absolute right-1/2 translate-x-1/2">
            <div className="flex gap-10 items-center max-w-[640px]">
                <button className="rounded border border-gray-800 font-bold px-2">&lt;</button>
                <BibleContent
                    selectedVersion={selectedVersion}
                    selectedBook={selectedBook}
                    selectedChapter={selectedChapter}
                    versions={versions}
                    books={books}
                />
                <button className="rounded border border-gray-800 font-bold px-2">&gt;</button>
            </div>
        </div>
    )
}