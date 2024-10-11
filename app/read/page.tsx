"use client";

import BibleContent from "@/app/read/bible-content";
import {Chapter, CompleteBook, Version} from "@/app/read/interfaces";
import {useMemo, useState, useTransition} from "react";

const authHeader = {headers: {"Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJGcmkgT2N0IDExIDIwMjQgMDI6MzI6NTggR01UKzAwMDAudmljaXNhcXVlNDEzQGdtYWlsLmNvbSIsImlhdCI6MTcyODYxMzk3OH0.G6CQF017thUiDKDb327R3ckcMmlFSBiHgfqIFsTtlYI`}}

interface ReadingData {
    versions: Version[],
    versionToSelect: Version,
    books: CompleteBook[],
    bookToSelect: CompleteBook,
    chapterToSelect: Chapter
}

export default function Page() {
    const [availableVersions, setAvailableVersions] = useState<Version[]>()
    const [availableBooks, setAvailableBooks] = useState<CompleteBook[]>()

    const [selectedVersion, setSelectedVersion] = useState<Version>()
    const [selectedBook, setSelectedBook] = useState<CompleteBook>()
    const [selectedChapter, setSelectedChapter] = useState<Chapter>()

    const [finishedFirstUpdate, setFinishedFirstUpdate] = useState(false)

    const [prevReadingData, setPrevReadingData] = useState<ReadingData>()
    const [nextReadingData, setNextReadingData] = useState<ReadingData>()

    const currentReadingData = useMemo(() => {
        return {
            versions: availableVersions!,
            books: availableBooks!,
            versionToSelect: selectedVersion!,
            bookToSelect: selectedBook!,
            chapterToSelect: selectedChapter!
        }
    }, [availableVersions, availableBooks, selectedVersion, selectedBook, selectedChapter])

    async function requestSelected(versionName: string, bookAbbreviation: string, chapterNumber: number) {
        let res!: Response;

        let versions!: Version[];
        if (!availableVersions) {
            res = await fetch("https://www.abibliadigital.com.br/api/versions", authHeader)
            versions = await res.json()
        } else {
            versions = availableVersions
        }

        const versionToSelect: Version = versions.filter(version => version.version === versionName)[0]

        let books!: CompleteBook[];
        if (!availableBooks) {
            res = await fetch("https://www.abibliadigital.com.br/api/books", authHeader)
            books = await res.json()
        } else {
            books = availableBooks
        }

        const bookToSelect: CompleteBook = books.filter(book => book.abbrev.en === bookAbbreviation)[0]

        res = await fetch(`https://www.abibliadigital.com.br/api/verses/${versionName}/${bookAbbreviation}/${chapterNumber}`, authHeader)
        const chapterToSelect: Chapter = await res.json()

        return {
            versions: versions,
            books: books,
            versionToSelect: versionToSelect,
            bookToSelect: bookToSelect,
            chapterToSelect: chapterToSelect
        }
    }

    async function updateSelection(data: ReadingData) {
        console.log(data)

        setAvailableVersions(data.versions)
        setSelectedVersion(data.versionToSelect)
        setAvailableBooks(data.books)
        setSelectedBook(data.bookToSelect)
        setSelectedChapter(data.chapterToSelect)

        setFinishedFirstUpdate(true)
    }

    async function onChangeSelection(selection: { changed: string, value: any }) {
        const o: { [key: string]: () => Promise<ReadingData> } = {
            version: () => requestSelected(selection.value, selectedBook!.abbrev.en, selectedChapter!.chapter.number),
            book: () => requestSelected(selectedVersion!.version, selection.value, selectedChapter!.chapter.number),
            chapter: () => requestSelected(selectedVersion!.version, selectedBook!.abbrev.en, selection.value),
        }

        const data = await o[selection.changed]()
        updateSelection(data)

        setPrevReadingData(await getPrevReadingData(data))
        setNextReadingData(await getNextReadingData(data))
    }

    async function getPrevBook(book: CompleteBook) {
        const booksWithIndexes: { book: CompleteBook, index: number }[] = availableBooks!.map((book, i) => {
            return {book: book, index: i}
        })

        const selectedBookIndex: number = booksWithIndexes.filter((data) => data.book.abbrev.en === book!.abbrev.en)[0].index
        return selectedBookIndex > 0 ? availableBooks!.at(selectedBookIndex - 1)! : null
    }

    async function getPrevReadingData(data: ReadingData) {
        if (data.chapterToSelect!.chapter.number === 1) {
            const prevBook = await getPrevBook(data.bookToSelect)
            return await requestSelected(data.versionToSelect!.version, prevBook!.abbrev.en, prevBook!.chapters)
        }

        return await requestSelected(data.versionToSelect!.version, data.bookToSelect!.abbrev.en, data.chapterToSelect!.chapter.number - 1)
    }

    async function selectPrevChapter() {
        const currentReadingDataBeforeChange: ReadingData = currentReadingData

        const currentReadingDataAfterChange = await getPrevReadingData(currentReadingDataBeforeChange)
        if (prevReadingData !== undefined && prevReadingData !== null) {
            await updateSelection(prevReadingData)
        } else {
            await updateSelection(currentReadingDataAfterChange)
        }

        setNextReadingData(currentReadingDataBeforeChange)
        const cachedNextReadingData = await getPrevReadingData(currentReadingDataAfterChange)
        setPrevReadingData(cachedNextReadingData)
    }

    async function getNextBook(book: CompleteBook) {
        const booksWithIndexes: { book: CompleteBook, index: number }[] = availableBooks!.map((book, i) => {
            return {book: book, index: i}
        })

        const selectedBookIndex: number = booksWithIndexes.filter((data) => data.book.abbrev.en === book!.abbrev.en)[0].index
        return selectedBookIndex < availableBooks!.length ? availableBooks!.at(selectedBookIndex + 1) : null
    }

    async function getNextReadingData(data: ReadingData) {
        if (data.chapterToSelect!.chapter.number === data.bookToSelect?.chapters) {
            const nextBook = await getNextBook(data.bookToSelect)
            return await requestSelected(data.versionToSelect!.version, nextBook!.abbrev.en, 1)
        }

        return await requestSelected(data.versionToSelect!.version, data.bookToSelect!.abbrev.en, data.chapterToSelect!.chapter.number + 1)
    }

    async function selectNextChapter() {
        const readingDataBeforeChange: ReadingData = currentReadingData

        const currentReadingDataAfterChange = await getNextReadingData(readingDataBeforeChange)
        if (nextReadingData !== undefined && nextReadingData !== null) {
            await updateSelection(nextReadingData)
        } else {
            await updateSelection(currentReadingDataAfterChange)
        }

        setPrevReadingData(readingDataBeforeChange)
        const cachedNextReadingData = await getNextReadingData(currentReadingDataAfterChange)
        setNextReadingData(cachedNextReadingData)
    }

    if (!finishedFirstUpdate) {
        const data = requestSelected("nvi", "jo", 1)
        data.then((data) => updateSelection(data))
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