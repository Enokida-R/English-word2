var form = document.forms.sendFile;
var allRows = [];
var currentAnswer = "";

form.csvFile.addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.addEventListener('load', function() {
        var text = reader.result;
        allRows = text.trim().split('\n');
        allRows.shift(); // 見出し削除

        askQuestion();
    });

    reader.readAsText(file);
});

function askQuestion() {
    var display = document.getElementById('word');
    var result = document.getElementById('result');
    result.textContent = ""; // 判定リセット

    // ランダムに問題を出題
    var qIndex = Math.floor(Math.random() * allRows.length);
    var [word, meaning] = allRows[qIndex].split(',');
    word = word.trim();
    meaning = meaning.trim();
    currentAnswer = meaning;

    display.textContent = word;
    display.value = meaning;

    // 正解の位置を決定
    var correctPos = Math.floor(Math.random() * 4);
    let usedMeanings = [meaning];

    for (let i = 0; i < 4; i++) {
        let label = document.getElementById('sel' + (i + 1));
        let input = label.querySelector('input');

        let choice;
        if (i === correctPos) {
            choice = meaning;
        } else {
            // ダブらないように選択肢を選ぶ
            do {
                let rand = Math.floor(Math.random() * allRows.length);
                choice = allRows[rand].split(',')[1].trim();
            } while (usedMeanings.includes(choice));
            usedMeanings.push(choice);
        }

        label.textContent = choice;
        label.prepend(input);
        input.value = choice;
        input.checked = false;
    }
}

// ラジオボタンがクリックされたときの処理を追加
document.querySelectorAll('input[name="select4"]').forEach(input => {
    input.addEventListener('change', function() {
        var result = document.getElementById('result');
        if (this.value === currentAnswer) {
            result.textContent = "正解！🎉";
        } else {
            result.textContent = "不正解！正解は: " + currentAnswer;
        }

        // 少し時間をおいて次の問題へ（例：1秒後）
        setTimeout(askQuestion, 1800);
    });
});
