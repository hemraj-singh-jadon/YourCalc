import { useState, useEffect, useRef } from 'react'


function Calculator() {
    const [currentValue, setCurrentValue] = useState('0')
    const [previousValue, setPreviousValue] = useState('')
    const [operator, setOperator] = useState('')
    const [repeatOperator, setRepeatOperator] = useState('')
    const [expression, setExpression] = useState('')
    const [lastOperand, setLastOperand] = useState(null)
    const [isListening, setIsListening] = useState(false);
    const [spokenQuery, setSpokenQuery] = useState("");



    function extractCurrentValue(value) {

        if (currentValue === 'Error') {
            setCurrentValue(value)
            setPreviousValue('')
            setExpression('')
            setOperator('')
            setLastOperand(null)
            return
        }

        if (lastOperand !== null) {

            setCurrentValue(value)
            setPreviousValue('')
            setExpression('')
            setOperator('')
            setLastOperand(null)
            return
        }
        if (value === '.' && currentValue.includes('.')) return
        setCurrentValue(prev => (prev === '0' ? value : prev + value))
    }

    // after final calculation reset values 

    function setOperatorValue(op) {

        if (lastOperand !== null) {
            setPreviousValue(currentValue)
            setCurrentValue('0')
            setOperator(op)
            setExpression(`${currentValue} ${op}`)
            setLastOperand(null)
            return
        }

        // Operator replacement (no recalculation)
        if (operator && currentValue === '0') {
            setOperator(op)
            setExpression(`${previousValue} ${op}`)
            return
        }

        // Calculate intermediate result
        if (operator && previousValue) {
            const result = calculate(
                Number(previousValue),
                Number(currentValue),
                operator
            )

        if (result === 'Error') {
            setCurrentValue('Error')
            setPreviousValue('')
            setExpression('Error')
            setOperator('')
            setLastOperand(null)
            return
        }
            setPreviousValue(String(result))
            setCurrentValue('0')
            setExpression(`${result} ${op}`)

        } else {
            setPreviousValue(currentValue)
            setCurrentValue('0')
            setExpression(`${currentValue} ${op}`)
        }

        setOperator(op)
        setLastOperand(null)
    }


    // key pressed using keyboard logic 

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key

            if (key >= '0' && key <= '9') extractCurrentValue(key)
            if (key === '.') extractCurrentValue('.')
            if (key === '+' || key === '-' || key === '*' || key === '/') {
                setOperatorValue(key === '*' ? 'x' : key)
            }
            if (key === 'Enter') {
                e.preventDefault()
                setFinalExpression()
            }

            if (key === 'Backspace') handleDelete()
            if (key === 'Escape' || key === 'Delete') handleClear()
            if (key === '%') handlePercentage()

            // mic on off using keypress 

            function isMacOS() {
                if (navigator.userAgentData?.platform) {
                    return navigator.userAgentData.platform === "macOS";
                }
                return /Mac/i.test(navigator.userAgent);
            }

            const isMac = isMacOS();

            if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "m") {
                e.preventDefault();
                micAccess();
            }

            if (e.key === "Escape") {
                stopMicManually();
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [currentValue, previousValue, operator, lastOperand])




    function calculate(a, b, op) {
        if (op === '+') return a + b
        if (op === '-') return a - b
        if (op === 'x') return a * b
        if (op === '/') return b === 0 ? 'Error' : a / b
        return b
    }

    function setFinalExpression() {
        if (!operator && !repeatOperator) return

        const op = operator || repeatOperator
        const a = Number(previousValue)
        const b = lastOperand ?? Number(currentValue)

        const result = calculate(a, b, op)

        if (result === 'Error') {
            setCurrentValue('Error')
            setPreviousValue('')
            setOperator('')
            setRepeatOperator('')
            setLastOperand(null)
            return
        }

        setCurrentValue(String(result))
        setPreviousValue(String(result))
        setExpression(`${a} ${op} ${b} =`)
        setLastOperand(b)

        setRepeatOperator(op)
        setOperator('')
    }


    function handlePercentage() {
        if (currentValue === 'Error') return
        const curr = Number(currentValue)
        const prev = Number(previousValue)
        let result

        if (!operator || previousValue === '') {
            result = curr / 100
        } else if (operator === '+' || operator === '-') {
            result = prev * curr / 100
        } else if (operator === 'x' || operator === '/') {
            result = curr / 100
        }

        setCurrentValue(String(result))
        setExpression(previousValue && operator ? `${previousValue} ${operator} ${result}` : '');

    }

    function handleClear() {
        setCurrentValue('0')
        setPreviousValue('')
        setOperator('')
        setRepeatOperator('')
        setExpression('')
        setLastOperand(null)
    }

    function handleDelete() {
        if (currentValue === 'Error' || lastOperand !== null) return

        setCurrentValue(prev =>
            prev.length > 1 ? prev.slice(0, -1) : '0'
        )
    }


    // Mic Logic starting from here First Filter Spoken Words

    function normalizeSpeech(text) {
        return text
            .toLowerCase()

            .replace(/\b(multiply by|multiplied by|multiply|into|guna|goona|gunda|ghuna|times|star)\b/g, 'x')
            .replace(/\*/g, 'x')

            .replace(/\b(devide by|devided by|divide|devided|divide|divide|bhagya|bhaga|bhag|bhag by|per|upon|slash)\b/g, '/')

            .replace(/\b(plus|add|added|sum|jod|jodna|jodo|joda)\b/g, '+')

            .replace(/\b(minus|subtract|subtracted|less|ghata|ghatana|kam)\b/g, '-')

            .replace(/\b(percent|percentage|pratishat)\b/g, '%')

            // clear other words which are not come under our use case
            .replace(/[^0-9x+\-/.% ]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function extractMath(text) {
        // Operator + % case (150 + 15%)
        let match = text.match(/(\d+(?:\.\d+)?)\s*([+\-x/])\s*(\d+(?:\.\d+)?)\s*%/);
        if (match) {
            return {
                a: Number(match[1]),
                op: match[2],
                b: Number(match[3]),
                isPercent: true,
            };
        }

        // Normal operator case (150 + 15)
        match = text.match(/(\d+(?:\.\d+)?)\s*([+\-x/])\s*(\d+(?:\.\d+)?)/);
        if (match) {
            return {
                a: Number(match[1]),
                op: match[2],
                b: Number(match[3]),
                isPercent: false,
            };
        }

        // Standalone percent (50%)
        match = text.match(/(\d+(?:\.\d+)?)\s*%/);
        if (match) {
            return {
                a: 0,
                op: null,
                b: Number(match[1]),
                isPercent: true,
            };
        }

        return null;
    }

    const recognitionRef = useRef(null)
    const micRunningRef = useRef(false)

    const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);


    // Desktop Speak Logic 

    function speakFemale(text) {

        if (isMobile()) return; 

        window.speechSynthesis.cancel();

        const voices = window.speechSynthesis.getVoices();

        const femaleVoice =
            voices.find((v) => v.name.includes("Zira")) ||
            voices.find((v) => v.name.includes("Samantha")) ||
            voices.find((v) => v.name.toLowerCase().includes("female")) ||
            voices.find((v) => v.lang.startsWith("en-US")) ||
            voices[0];

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = femaleVoice;
        utterance.rate = 1;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
    }

    useEffect(() => {
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }, []);


    // SpeechRecognition setup

    useEffect(() => {

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const rec = new SpeechRecognition();
        rec.lang = "en-IN";
        rec.continuous = false;
        rec.interimResults = false;

        rec.onstart = () => {
            micRunningRef.current = true;
            setIsListening(true);
            if (!isMobile()) speakFemale("I’m listening");
        };

        rec.onend = () => {
            micRunningRef.current = false;
            setIsListening(false);
        };

        rec.onerror = (e) => {
            console.error("Speech error:", e.error);
            micRunningRef.current = false;
            setIsListening(false);
        };

        rec.onresult = (event) => {
            const raw = event.results[0][0].transcript;
            const normalized = normalizeSpeech(raw);
            setSpokenQuery(normalized);
            const math = extractMath(normalized);

            if (!math) return;

            let { a, b, op, isPercent } = math;
            let calcB = b;
            let displayB = b;

            if (isPercent) {
                if (!op) calcB = b / 100;
                else if (op === "+" || op === "-") calcB = (a * b) / 100;
                else calcB = b / 100;
                displayB = calcB;
            }

            const result = op ? calculate(a, calcB, op) : calcB;

            if (result === "Error") {
                handleClear();
                setCurrentValue("Error");
                return;
            }

            setCurrentValue(String(result));

            if (!op) {
                setExpression(a && op ? `${a} ${op}` : "");
                return;
            }

            setPreviousValue(String(result));
            setLastOperand(displayB);
            setExpression(`${a} ${op} ${displayB} =`);
            setRepeatOperator(op);
            setOperator("");
        };

        recognitionRef.current = rec;

        return () => {
            if (micRunningRef.current) rec.abort();
        };
    }, []);


    // Mic button logic

    const micAccess = () => {
        const rec = recognitionRef.current;
        if (!rec) return;

        if (micRunningRef.current) {
            rec.abort();
            if (!isMobile()) speakFemale("Microphone is off");
        } else {
            handleClear();
            rec.start(); 
        }
    };


    //   Mic stop logic 

    const stopMicManually = () => {
        const rec = recognitionRef.current;
        if (!rec || !micRunningRef.current) return;

        rec.abort();
        micRunningRef.current = false;
        setIsListening(false);

        if (!isMobile()) speakFemale("Microphone is off");
    };


    // Reset spoken query

    useEffect(() => {
        if (!spokenQuery) return;
        const timer = setTimeout(() => setSpokenQuery(""), 4000);
        return () => clearTimeout(timer);
    }, [spokenQuery]);



    return (
        <>
            <div className="calculator">
            
                <div className="output">
                    <div className="preview-output">{expression}</div>
                    <div className="current-output">{currentValue}</div>
                </div>

                <button onPointerDown={handleClear}>AC</button>
                <button onPointerDown={handleDelete}>DEL</button>
                <button onPointerDown={handlePercentage}>%</button>
                <button onPointerDown={() => setOperatorValue("/")}>/</button>

                <button onPointerDown={() => extractCurrentValue("7")}>7</button>
                <button onPointerDown={() => extractCurrentValue("8")}>8</button>
                <button onPointerDown={() => extractCurrentValue("9")}>9</button>
                <button onPointerDown={() => setOperatorValue("x")}>x</button>

                <button onPointerDown={() => extractCurrentValue("4")}>4</button>
                <button onPointerDown={() => extractCurrentValue("5")}>5</button>
                <button onPointerDown={() => extractCurrentValue("6")}>6</button>
                <button onPointerDown={() => setOperatorValue("-")}>−</button>

                <button onPointerDown={() => extractCurrentValue("1")}>1</button>
                <button onPointerDown={() => extractCurrentValue("2")}>2</button>
                <button onPointerDown={() => extractCurrentValue("3")}>3</button>
                <button onPointerDown={() => setOperatorValue("+")}>+</button>

                <button onPointerDown={() => extractCurrentValue(".")}>.</button>
                <button onPointerDown={() => extractCurrentValue("0")}>0</button>

                <button className={`mic-btn ${isListening ? "listening" : ""}`} onPointerDown={micAccess}>{isListening ? <span className="material-symbols-outlined">mic_off</span> : <span className="material-symbols-outlined">mic</span>}</button>
                <button className="null" onPointerDown={setFinalExpression}>=</button>
            </div>

            {spokenQuery && (
                <div className="voice-preview">
                    I heard — <strong>{spokenQuery}</strong>
                </div>
            )}

        </>
    )
}

export default Calculator

