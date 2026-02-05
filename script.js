const magicButton = document.getElementById('magicButton');
const copyContainer = document.getElementById('copyContainer');
const copyBtn = document.getElementById('copyButton');
const verbInput = document.getElementById('verbInput');
const resultArea = document.getElementById('results');

magicButton.addEventListener('click', async () => {
    console.log("Button was clicked!");

    const verb = verbInput.value.trim();
    if(!verb) return;

    resultArea.innerHTML = `<p>Getting conjugations for: ${verb}...</p>`;

    const url = `https://qutrub.arabeyes.org/api?verb=${encodeURIComponent(verb)}`;
    
    try{
        const response = await fetch(url);
        const data = await response.json();

        resultArea.innerHTML = '';

        const bigBox = document.createElement('div');
        bigBox.className = 'verb-box';

        let uniqueVerbs = new Set();
        const tashkeelRegex = /[\u064B-\u0652]/g;

        if(data && data.result)
        {
            const grid = data.result;
            uniqueVerbs.clear();

            for(let i=1; i<=14; i++)
            {
                const row = grid[i.toString()];

                if(row)
                {
                    for(let j=1; j<=12; j++)
                    {
                        const conjugation = row[j.toString()];

                        if(conjugation && conjugation.trim() !== "")
                        {
                            let cleanWord = conjugation.replace(tashkeelRegex, "");
                            uniqueVerbs.add(cleanWord);
                        }
                    }
                }
            }

            if(uniqueVerbs.size > 0)
            {
                bigBox.innerHTML = Array.from(uniqueVerbs).join("<br>");
                resultArea.appendChild(bigBox);
                copyContainer.style.display = 'flex';
            }
            else
            {
                showErrorState();
            }
        }
        else
        {
            showErrorState();
        }
    }
    catch(error)
    {
        resultArea.innerHTML = 'The server encountered an error, please try again.';
        console.error(error);
    }
});

function showErrorState()
{
    resultArea.innerHTML = `<div style="color: #e74c3c; margin-top: 20px; font-weight: bold;">
                    ⚠️ That doesn't look like a valid verb. Please try again!
                </div>`;
    copyContainer.style.display = 'none';
    resultArea.classList.add('shake');
    setTimeout(() => resultArea.classList.remove('shake'), 300);
}

copyBtn.addEventListener('click', () => {
    const textToCopy = document.querySelector('.verb-box').innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "✅ Copied!";
        copyBtn.style.backgroundColor = "#27ae60";

        setTimeout(() =>{
            copyBtn.innerText = originalText;
            copyBtn.style.backgroundColor = "#3498db";
        }, 2000);
    });
});

copyBtn.style.display = 'block';