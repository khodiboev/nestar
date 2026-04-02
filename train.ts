// TASK-ZK:
// Shunday function yozing, u har soniyada bir marta consolega 1 dan 5 gacha bolgan raqamlarni chop etsin va 5 soniyadan keyin ishini toxtatsin.
// MASALAN: printNumbers()

function printNumbers() {
	let count = 0;
	const intervalId = setInterval(() => {
		const randomNum = Math.floor(Math.random() * 5) + 1;
		console.log(randomNum);
		count++;
		if (count >= 5) {
			clearInterval(intervalId);
		}
	}, 1000);
}
printNumbers();

// TASK ZJ:
// Shunday function yozing, u berilgan array ichidagi
// raqamlarni qiymatini hisoblab qaytarsin.
// MASALAN: reduceNestedArray([1, [1, 2, [4]]]); return 8;
// Yuqoridagi misolda, array nested bo'lgan holdatda ham,
// bizning function ularning yig'indisini hisoblab qaytarmoqda.

// function reduceNestedArray(arr: any[]): number {
//   let sum = 0;
//   for (const item of arr) {
//     if (Array.isArray(item)) {
//       sum += reduceNestedArray(item); // Rekursiv chaqiriq
//     } else if (typeof item === 'number') {
//       sum += item; // Raqamlarni yig'ish
//     }
//   }
//   return sum;
// }
// console.log(reduceNestedArray([1, [1, 2, [4]]]));
