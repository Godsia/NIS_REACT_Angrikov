export interface ITrainingTypes {
    label: string;
    value: number;
    type: 'power' | 'endurance';
}

export const trainingTypes: ITrainingTypes[] = [
    { label: 'Жим лёжа', value: 1, type: 'power' },
    { label: 'Приседания со штангой', value: 2, type: 'power' },
    { label: 'Становая тяга', value: 3, type: 'power' },
    { label: 'Подтягивания', value: 4, type: 'power' },
    { label: 'Армейский жим', value: 5, type: 'power' },
    { label: 'Бицепс со штангой', value: 6, type: 'power' },
    { label: 'Тяга верхнего блока', value: 7, type: 'power' },
    { label: 'Отжимания на брусьях', value: 8, type: 'power' },
    { label: 'Бег', value: 9, type: 'endurance' },
    { label: 'Велосипед', value: 10, type: 'endurance' },
    { label: 'Эллиптический тренажёр', value: 11, type: 'endurance' },
    { label: 'Гребля', value: 12, type: 'endurance' },
    { label: 'Скакалка', value: 13, type: 'endurance' },
    { label: 'Плавание', value: 14, type: 'endurance' },
    { label: 'Ходьба / Туризм', value: 15, type: 'endurance' },
];