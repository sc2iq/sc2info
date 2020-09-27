
import React from 'react'
import { NavLink } from "react-router-dom"
import sc2extractor from "@sc2/extractor"
import './Search.css'
import './Ask.css'
import lodashThrottle from 'lodash.throttle'

const Ask: React.FC = () => {
    const searchIconRef = React.useRef<HTMLInputElement>(null)
    const [question, setQuestion] = React.useState('')
    const [answer, setAnswer] = React.useState('')
    const onClickClear = () => {
        setQuestion('')
        setAnswer('')
        searchIconRef.current?.focus()
    }

    const onChangeQuestionInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value)
    }

    const onKeyDownSearchInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'Escape':
                onClickClear()
                break
            case 'Enter':
                if (question.length > 4) {
                    setAnswer('')
                    setThrottledExtractionAnswer(question)
                }
                break
        }
    }

    const extractionThrottleTime = 1000
    const setThrottledExtractionAnswer = React.useCallback(lodashThrottle(async (phrase: string) => {
        const extraction = await sc2extractor(phrase)
        if (extraction?.answer) {
            setAnswer(extraction?.answer)
        }
        else {
            setAnswer(`No Answer for given input: "${phrase}"`)
        }
    }, extractionThrottleTime), [])

    const onClickSearchIcon = () => {
        searchIconRef.current?.focus()
    }

    React.useEffect(() => {
        searchIconRef.current?.focus()
    }, [searchIconRef])

    return (
        <>
            <div className="search-header">
                <div className="search-input">
                    <div className="search-input__icon" onClick={onClickSearchIcon}>
                    </div>
                    <input value={question}
                        className="search-input__control"
                        onChange={onChangeQuestionInput}
                        onKeyDown={onKeyDownSearchInput}
                        ref={searchIconRef}
                        placeholder={`Try "How many minerals does a Marine cost?" or shorthand "Marine Cost?"`}
                        spellCheck={false}
                        autoComplete="off"
                    />
                    <button className="search-input__close" onClick={onClickClear}>
                        &times;
                    </button>
                </div>
            </div>

            <section>
                <h3>Answer:</h3>
                <p className="ask-answer">{answer ?? 'None'}</p>
            </section>
            <section className="search-footer">
                <p>Not working for you? Try <NavLink to={`/`}>Searching</NavLink> or <NavLink to={`/browse`}>Browsing</NavLink></p>

                <ul>
                    <li><NavLink to={`/units`}>Units</NavLink></li>
                    <li><NavLink to={`/abilities`}>Abilities</NavLink></li>
                    <li><NavLink to={`/buildings`}>Buildings</NavLink></li>
                    <li><NavLink to={`/upgrades`}>Upgrades</NavLink></li>
                    <li><NavLink to={`/weapons`}>Weapons</NavLink></li>
                </ul>
            </section>
        </>
    )
}

export default Ask
