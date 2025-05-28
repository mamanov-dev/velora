import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GeneratedBook {
  title: string;
  chapters: Array<{
    number: number;
    title: string;
    content: string;
  }>;
  totalChapters: number;
  estimatedReadTime: number;
}

export async function POST(request: NextRequest) {
  try {
    const { bookType, answers } = await request.json();

    // Создаем промпт на основе типа книги и ответов
    const prompt = generatePrompt(bookType, answers);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Ты профессиональный писатель персональных книг. Создавай красивые, эмоциональные истории на русском языке на основе предоставленной информации. Книга должна быть структурированной с главами и красивым повествованием."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    const generatedBook = completion.choices[0]?.message?.content;

    if (!generatedBook) {
      throw new Error('Не удалось сгенерировать книгу');
    }

    // Обрабатываем и структурируем книгу
    const structuredBook = structureBook(generatedBook, bookType);

    return NextResponse.json({ 
      success: true, 
      book: structuredBook,
      metadata: {
        bookType,
        generatedAt: new Date().toISOString(),
        wordCount: generatedBook.split(' ').length
      }
    });

  } catch (error) {
    console.error('Ошибка генерации книги:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Произошла ошибка при генерации книги' 
      },
      { status: 500 }
    );
  }
}

function generatePrompt(bookType: string, answers: Record<string, string>): string {
  switch (bookType) {
    case 'romantic':
      return `
Создай романтическую книгу на основе следующей информации:
- Имя партнера: ${answers.partner_name}
- Знакомство: ${answers.relationship_start}
- Первая встреча: ${answers.first_meeting}
- Любимые моменты: ${answers.favorite_moments}
- Особенные места: ${answers.special_places}
- Качества партнера: ${answers.partner_qualities}
- Общие мечты: ${answers.shared_dreams}

Создай красивую романтическую историю с 5-6 главами. Включи:
1. Главу о знакомстве
2. Главу о первых моментах вместе
3. Главу о любимых воспоминаниях
4. Главу о том, что делает отношения особенными
5. Главу о будущих мечтах
6. Заключение с признанием в любви

Используй эмоциональный, красивый язык. Объем примерно 1500-2000 слов.
      `;

    case 'family':
      return `
Создай семейную книгу на основе следующей информации:
- Члены семьи: ${answers.family_members}
- История семьи: ${answers.family_history}
- Традиции: ${answers.special_traditions}
- Запоминающиеся события: ${answers.memorable_events}

Создай теплую семейную историю с главами:
1. История создания семьи
2. Семейные традиции и ценности
3. Незабываемые моменты
4. Что делает нашу семью особенной
5. Пожелания на будущее

Используй теплый, семейный тон. Объем примерно 1500-2000 слов.
      `;

    case 'friendship':
      return `
Создай книгу о дружбе на основе следующей информации:
- Имя друга: ${answers.friend_name}
- История дружбы: ${answers.friendship_story}
- Совместные приключения: ${answers.shared_adventures}
- Качества друга: ${answers.friendship_qualities}

Создай веселую и трогательную историю дружбы с главами:
1. Как мы познакомились
2. Наши приключения
3. Что делает нашу дружбу особенной
4. Благодарность за дружбу
5. Дружба на всю жизнь

Используй дружелюбный, теплый тон с юмором. Объем примерно 1200-1800 слов.
      `;

    default:
      return 'Создай персональную книгу на основе предоставленной информации.';
  }
}

function structureBook(content: string, bookType: string): GeneratedBook {
  // Разбиваем книгу на главы
  const chapters = content.split(/Глава \d+|ГЛАВА \d+|\d+\./g).filter(chapter => chapter.trim().length > 50);
  
  const bookTitle = getBookTitle(bookType);
  
  return {
    title: bookTitle,
    chapters: chapters.map((chapter, index) => ({
      number: index + 1,
      title: getChapterTitle(bookType, index + 1),
      content: chapter.trim()
    })),
    totalChapters: chapters.length,
    estimatedReadTime: Math.ceil(content.split(' ').length / 200) // 200 слов в минуту
  };
}

function getBookTitle(bookType: string): string {
  switch (bookType) {
    case 'romantic':
      return 'Наша История Любви';
    case 'family':
      return 'Семейная Хроника';
    case 'friendship':
      return 'Книга Нашей Дружбы';
    default:
      return 'Персональная Книга';
  }
}

function getChapterTitle(bookType: string, chapterNumber: number): string {
  const titles = {
    romantic: [
      'Наша Встреча',
      'Первые Чувства', 
      'Особенные Моменты',
      'Что Нас Связывает',
      'Наши Мечты',
      'Любовь Навсегда'
    ],
    family: [
      'Начало Истории',
      'Семейные Традиции',
      'Незабываемые Моменты', 
      'Семейные Ценности',
      'Взгляд в Будущее'
    ],
    friendship: [
      'Как Всё Началось',
      'Наши Приключения',
      'Особенная Дружба',
      'Благодарность',
      'Друзья Навсегда'
    ]
  };

  const typeChapters = titles[bookType as keyof typeof titles] || ['Глава'];
  return typeChapters[chapterNumber - 1] || `Глава ${chapterNumber}`;
}