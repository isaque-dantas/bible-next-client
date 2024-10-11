import Selector from "@/app/read/selector";
import {Chapter, CompleteBook, Version} from "@/app/read/interfaces";
import {useMemo} from "react";

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
    availableVersions: Version[];
    availableBooks: CompleteBook[];
    selectedChapter: Chapter;
    onChangeSelection: (selection: { changed: string, value: string | number }) => void
}

// @ts-ignore
export default function BibleContent({
                                         onChangeSelection,
                                         selectedVersion,
                                         selectedBook,
                                         selectedChapter,
                                         availableVersions,
                                         availableBooks
                                     }: Props) {

    const parsedContent = useMemo(() => selectedChapter.verses.map((verse, i) => <p key={i}><em
        className="pe-2 text-cyan-600">{verse.number}</em>{verse.text}</p>), [selectedChapter])

    return (<div className="flex flex-col">
        <Selector
            onChange={onChangeSelection}
            chaptersAmount={selectedBook.chapters}
            versions={availableVersions}
            books={availableBooks}
            selectedVersion={selectedVersion}
            selectedBook={selectedBook}
            selectedChapter={selectedChapter}
        />
        <section className="mt-4 flex flex-col gap-2 max-h-[75vh] overflow-y-scroll">
            {parsedContent}
        </section>
    </div>)
}