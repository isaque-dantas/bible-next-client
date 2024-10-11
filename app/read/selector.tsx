import {FormEvent} from "react";
import {Chapter, CompleteBook, Version} from "@/app/read/interfaces";

interface Props {
    onChange: (selection: { changed: string, value: string | number }) => void,
    chaptersAmount: number,
    versions: Version[],
    books: CompleteBook[],
    selectedVersion: Version,
    selectedBook: CompleteBook,
    selectedChapter: Chapter
}

export default function Selector({
                                     onChange,
                                     chaptersAmount,
                                     versions,
                                     books,
                                     selectedVersion,
                                     selectedBook,
                                     selectedChapter
                                 }: Props) {

    function handleChange(e: FormEvent) {
        e.preventDefault()
        onChange({changed: e.target.name, value: e.target.value})
    }

    const chapterOptions = []
    for (let i = 1; i <= chaptersAmount; i++) {
        chapterOptions.push(<option key={i} value={i}>Capítulo {i}</option>)
    }

    const booksOptions = books.map(
        (book, i) => <option key={i} value={book.abbrev.en}>{book.name}</option>, books)

    const versionsOptions = versions.map(
        (version, i) => <option key={i} value={version.version}>{version.version.toUpperCase()}</option>, versions)

    return (<>
        <form onChange={handleChange}>
            <div className="flex gap-2">
                <select value={selectedChapter!.chapter.number} name="chapter" id="chapter" className="ps-2 pe-6 py-2">
                    {chapterOptions}
                </select>

                <select value={selectedBook!.abbrev.en} name="book" id="book" className="ps-2 pe-6 py-2">
                    {booksOptions}
                </select>

                <select value={selectedVersion.version} name="version" id="version" className="ps-2 pe-6 py-2">
                    {versionsOptions}
                </select>
            </div>
        </form>
    </>)
}