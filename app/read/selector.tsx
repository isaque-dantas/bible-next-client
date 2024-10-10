import {FormEvent} from "react";
import {Chapter, CompleteBook, Version} from "@/app/read/interfaces";
import {type} from "node:os";

interface Props {
    onChange: (changing: { value: string | number, propertyName: string }) => void,
    chaptersAmount: number,
    versions: Version[],
    books: CompleteBook[]
}

export default function Selector(
    {onChange, chaptersAmount, versions, books}: Props) {

    function handleChange(e: FormEvent) {
        e.preventDefault()
        console.log(e)

        onChange({propertyName: e.target.name, value: e.target.value})
    }

    const chapterOptions = []
    for (let i = 1; i <= chaptersAmount; i++) {
        chapterOptions.push(<option key={i} value={i}>Capítulo {i}</option>)
    }

    const booksOptions = books.map(
        (book, i) => <option key={i} value={book.abbrev.en}>{book.name}</option>, books
    )

    const versionsOptions = versions.map(
        (version, i) => <option key={i} value={version.version}>{version.version.toUpperCase()}</option>, versions
    )

    return (
        <>
            <form onChange={handleChange}>
                <div className="flex gap-2">
                    <select name="chapter" id="chapter" className="ps-2 pe-6 py-2">
                        {chapterOptions}
                    </select>

                    <select name="book" id="book" className="ps-2 pe-6 py-2">
                        {booksOptions}
                    </select>

                    <select name="version" id="version" className="ps-2 pe-6 py-2">
                        {versionsOptions}
                    </select>
                </div>
            </form>
        </>
    )
}