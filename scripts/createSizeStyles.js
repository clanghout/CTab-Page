// Run with node.js to update sizeStyles.css
const fs = require('fs');

let computedStyle = "/* GENERATED STYLES, make changes using the 'scripts/createSizeStyles.js' script.*/";

for (let i = 1; i <= 12; i++) {
    computedStyle +=
        `
.w${i} {
    width: ${i * 150 + (i - 1) * 10}px;
}

.he${i} {
    height: ${i * 60 + (i - 1) * 10}px;
}
`;
}

fs.writeFile('sizeStyles.css', computedStyle, function (err) {
    if (err) throw err;
    console.log("saved");
});
