"use client";

import BibleContent from "@/app/read/bible-content";
import {Chapter, CompleteBook, Version} from "@/app/read/interfaces";
import {useState} from "react";

const authHeader = {headers: {"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJGcmkgT2N0IDExIDIwMjQgMDI6MzI6NTggR01UKzAwMDAudmljaXNhcXVlNDEzQGdtYWlsLmNvbSIsImlhdCI6MTcyODYxMzk3OH0.G6CQF017thUiDKDb327R3ckcMmlFSBiHgfqIFsTtlYI`}}

export default function Page() {
    const [availableVersions, setAvailableVersions] = useState<Version[]>()
    const [selectedVersion, setSelectedVersion] = useState<Version>()
    const [availableBooks, setAvailableBooks] = useState<CompleteBook[]>()
    const [selectedBook, setSelectedBook] = useState<CompleteBook>()
    const [selectedChapter, setSelectedChapter] = useState<Chapter>()
    const [finishedFirstUpdate, setFinishedFirstUpdate] = useState(false)

    async function updateSelection(versionName: string, bookAbbreviation: string, chapterNumber: number) {
        console.log("requests xD")

        let res = await fetch("https://www.abibliadigital.com.br/api/versions", authHeader)
        const versions: Version[] = await res.json()

        setAvailableVersions(versions)
        const versionToSelect = versions.filter(version => version.version === versionName)[0]
        setSelectedVersion(versionToSelect)

        res = await fetch("https://www.abibliadigital.com.br/api/books", authHeader)
        const books: CompleteBook[] = await res.json()

        setAvailableBooks(books)
        const bookToSelect = books.filter(book => book.abbrev.en === bookAbbreviation)[0]
        setSelectedBook(bookToSelect)

        res = await fetch(`https://www.abibliadigital.com.br/api/verses/${versionName}/${bookAbbreviation}/${chapterNumber}`, authHeader)
        const chapter: Chapter = await res.json()
        setSelectedChapter(chapter)

        setFinishedFirstUpdate(true)
    }

    if (!finishedFirstUpdate) {
        updateSelection("nvi", "jo", 1)
    }

    function onChangeSelection(selection: { changed: string, value: any }) {
        console.log(selection)
        if (selection.changed === "version") {
            updateSelection(selection.value, selectedBook!.abbrev.en, selectedChapter!.chapter.number)
        } else if (selection.changed === "book") {
            updateSelection(selectedVersion!.version, selection.value, selectedChapter!.chapter.number)
        } else if (selection.changed === "chapter") {
            updateSelection(selectedVersion!.version, selectedBook!.abbrev.en, selection.value)
        }
    }

    async function selectPrevChapter() {
        if (selectedChapter!.chapter.number === 1) {
            const res = await fetch("https://www.abibliadigital.com.br/api/books", authHeader)
            const books: CompleteBook[] = await res.json()

            const booksWithIndexes: { book: CompleteBook, index: number }[] = books.map((book, i) => {
                return {book: book, index: i}
            })

            const selectedBookIndex: number =
                booksWithIndexes.filter((data) => data.book.abbrev.en === selectedBook!.abbrev.en)[0].index

            if (selectedBookIndex > 0) {
                const prevBook = books.at(selectedBookIndex - 1)!
                updateSelection(selectedVersion!.version, prevBook!.abbrev.en, prevBook.chapters)
                return;
            }
        }

        updateSelection(selectedVersion!.version, selectedBook!.abbrev.en, selectedChapter!.chapter.number - 1)
    }

    async function selectNextChapter() {
        if (selectedChapter!.chapter.number === selectedBook?.chapters) {
            const res = await fetch("https://www.abibliadigital.com.br/api/books", authHeader)
            const books: CompleteBook[] = await res.json()

            const booksWithIndexes: { book: CompleteBook, index: number }[] = books.map((book, i) => {
                return {book: book, index: i}
            })

            const selectedBookIndex: number =
                booksWithIndexes.filter((data) => data.book.abbrev.en === selectedBook!.abbrev.en)[0].index

            if (selectedBookIndex < books.length) {
                updateSelection(selectedVersion!.version, books.at(selectedBookIndex + 1)!.abbrev.en, 1)
                return;
            }
        }

        updateSelection(selectedVersion!.version, selectedBook!.abbrev.en, selectedChapter!.chapter.number + 1)
    }

    return (<div className="my-20 absolute right-1/2 translate-x-1/2">
        <div className="flex gap-10 items-center max-w-[640px]">
            <button onClick={selectPrevChapter} className="rounded border border-gray-800 font-bold px-2">&lt;</button>
            {finishedFirstUpdate && <BibleContent
                selectedVersion={selectedVersion!}
                selectedBook={selectedBook!}
                selectedChapter={selectedChapter!}
                availableVersions={availableVersions!}
                availableBooks={availableBooks!}
                onChangeSelection={onChangeSelection}
            />}
            {!finishedFirstUpdate && <p>Loading!</p>}
            <button onClick={selectNextChapter} className="rounded border border-gray-800 font-bold px-2">&gt;</button>
        </div>
    </div>)
}