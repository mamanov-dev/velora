'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Upload, Heart, Users, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'file';
  placeholder?: string;
  required: boolean;
}

interface BookType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  price: string;
  questions: Question[];
}

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

const bookTypes: BookType[] = [
  {
    id: 'romantic',
    title: 'Романтическая книга',
    description: 'Для второй половинки',
    icon: Heart,
    price: '2,990₽',
    questions: [
      {
        id: 'partner_name',
        text: 'Как зовут вашу вторую половинку?',
        type: 'text',
        placeholder: 'Полное имя или как вы обращаетесь',
        required: true
      },
      {
        id: 'relationship_duration',
        text: 'Как долго вы вместе?',
        type: 'text',
        placeholder: '2 года, 6 месяцев, с 2019 года...',
        required: true
      },
      {
        id: 'first_meeting_place',
        text: 'Где и как вы познакомились?',
        type: 'textarea',
        placeholder: 'Опишите место встречи подробно (минимум 30 слов)',
        required: true
      },
      {
        id: 'first_impression',
        text: 'Какое первое впечатление произвел на вас партнер?',
        type: 'textarea',
        placeholder: 'Что вы подумали при первой встрече? (минимум 40 слов)',
        required: true
      },
      {
        id: 'first_date_story',
        text: 'Расскажите о вашем первом свидании',
        type: 'textarea',
        placeholder: 'Куда пошли, что делали, как прошло... (минимум 60 слов)',
        required: true
      },
      {
        id: 'moment_of_love_realization',
        text: 'Когда вы поняли, что влюбились?',
        type: 'textarea',
        placeholder: 'Опишите этот особенный момент (минимум 50 слов)',
        required: true
      },
      {
        id: 'partner_best_qualities',
        text: 'Какие качества партнера вы цените больше всего?',
        type: 'textarea',
        placeholder: 'Черты характера, поступки, особенности... (минимум 40 слов)',
        required: true
      },
      {
        id: 'happiest_moment_together',
        text: 'Самый счастливый момент в ваших отношениях',
        type: 'textarea',
        placeholder: 'Опишите подробно этот особенный момент (минимум 60 слов)',
        required: true
      },
      {
        id: 'funniest_memory',
        text: 'Самый смешной случай, который произошел с вами',
        type: 'textarea',
        placeholder: 'Веселая история из ваших отношений (минимум 50 слов)',
        required: true
      },
      {
        id: 'romantic_moments',
        text: 'Самые романтичные моменты ваших отношений',
        type: 'textarea',
        placeholder: 'Сюрпризы, подарки, особенные жесты... (минимум 50 слов)',
        required: true
      },
      {
        id: 'special_places',
        text: 'Ваши особенные места',
        type: 'textarea',
        placeholder: 'Места, которые многое значат для ваших отношений (минимум 40 слов)',
        required: true
      },
      {
        id: 'couple_traditions',
        text: 'Ваши парные традиции и ритуалы',
        type: 'textarea',
        placeholder: 'То, что вы делаете вместе регулярно (минимум 40 слов)',
        required: true
      },
      {
        id: 'overcoming_difficulties',
        text: 'Как вы преодолевали трудности вместе?',
        type: 'textarea',
        placeholder: 'Сложные ситуации, которые вас сблизили (минимум 50 слов)',
        required: true
      },
      {
        id: 'shared_dreams',
        text: 'О чем вы мечтаете вместе?',
        type: 'textarea',
        placeholder: 'Планы на будущее, путешествия, цели... (минимум 50 слов)',
        required: true
      },
      {
        id: 'love_declaration',
        text: 'Что бы вы хотели сказать партнеру в завершение книги?',
        type: 'textarea',
        placeholder: 'Ваши самые важные слова любви (минимум 60 слов)',
        required: true
      },
      {
        id: 'photos',
        text: 'Загрузите ваши лучшие совместные фотографии',
        type: 'file',
        required: true
      }
    ]
  },
  {
    id: 'family',
    title: 'Семейная хроника',
    description: 'Для всей семьи',
    icon: Users,
    price: '3,990₽',
    questions: [
      {
        id: 'family_members',
        text: 'Перечислите всех членов семьи',
        type: 'textarea',
        placeholder: 'Имена, возраст, роли в семье... (минимум 40 слов)',
        required: true
      },
      {
        id: 'family_history',
        text: 'Расскажите историю создания вашей семьи',
        type: 'textarea',
        placeholder: 'Как познакомились родители, семейные корни... (минимум 60 слов)',
        required: true
      },
      {
        id: 'family_traditions',
        text: 'Какие традиции есть в вашей семье?',
        type: 'textarea',
        placeholder: 'Праздники, ритуалы, особые моменты... (минимум 50 слов)',
        required: true
      },
      {
        id: 'memorable_family_events',
        text: 'Самые запоминающиеся семейные события',
        type: 'textarea',
        placeholder: 'Дни рождения, путешествия, достижения... (минимум 60 слов)',
        required: true
      },
      {
        id: 'family_values',
        text: 'Какие ценности важны для вашей семьи?',
        type: 'textarea',
        placeholder: 'Принципы, убеждения, жизненные правила... (минимум 40 слов)',
        required: true
      },
      {
        id: 'family_photos',
        text: 'Загрузите семейные фотографии',
        type: 'file',
        required: true
      }
    ]
  },
  {
    id: 'friendship',
    title: 'Книга дружбы',
    description: 'Для лучших друзей',
    icon: BookOpen,
    price: '2,490₽',
    questions: [
      {
        id: 'friend_name',
        text: 'Как зовут вашего друга?',
        type: 'text',
        placeholder: 'Имя друга',
        required: true
      },
      {
        id: 'friendship_beginning',
        text: 'История начала вашей дружбы',
        type: 'textarea',
        placeholder: 'Как познакомились, первые впечатления... (минимум 50 слов)',
        required: true
      },
      {
        id: 'shared_adventures',
        text: 'Ваши совместные приключения',
        type: 'textarea',
        placeholder: 'Путешествия, веселые истории, незабываемые моменты... (минимум 60 слов)',
        required: true
      },
      {
        id: 'friendship_qualities',
        text: 'За что вы цените этого друга?',
        type: 'textarea',
        placeholder: 'Черты характера, поддержка, особенности... (минимум 40 слов)',
        required: true
      },
      {
        id: 'funny_friendship_moments',
        text: 'Самые смешные моменты вашей дружбы',
        type: 'textarea',
        placeholder: 'Веселые истории, шутки, курьезы... (минимум 50 слов)',
        required: true
      },
      {
        id: 'friendship_photos',
        text: 'Загрузите фотографии с другом',
        type: 'file',
        required: true
      }
    ]
  }
];

export default function CreateBook() {
  console.log('CreateBook компонент загружается!');
  
  const [selectedType, setSelectedType] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | FileList>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBook, setGeneratedBook] = useState<GeneratedBook | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});

  const currentBookType = bookTypes.find(bt => bt.id === selectedType);
  const totalSteps = currentBookType ? currentBookType.questions.length + 2 : 2;

  const handleTypeSelect = (typeId: string) => {
    // Очищаем предыдущие ответы при смене типа
    setSelectedType(typeId);
    setAnswers({});
    setUploadedFiles({});
    setCurrentStep(1);
  };

  const handleAnswerChange = (questionId: string, value: string | FileList) => {
    if (value instanceof FileList) {
      // Обработка файлов
      const files = Array.from(value);
      const validFiles = files.filter(file => {
        // Валидация: только изображения до 5MB
        return file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024;
      });
      
      setUploadedFiles(prev => ({
        ...prev,
        [questionId]: validFiles
      }));
      
      setAnswers(prev => ({
        ...prev,
        [questionId]: validFiles.length > 0 ? 'files_uploaded' : ''
      }));
    } else {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  const handleNext = async () => {
    console.log('handleNext вызвана, currentStep:', currentStep, 'totalSteps:', totalSteps);
    
    if (currentBookType && currentStep < totalSteps - 2) {
      console.log('Переход к следующему вопросу');
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === totalSteps - 2) {
      console.log('Начинаем генерацию книги');
      // Валидация перед отправкой
      const currentQuestion = getCurrentQuestion();
      if (currentQuestion?.required && !isStepComplete()) {
        console.log('Ошибка: не все обязательные поля заполнены');
        alert('Пожалуйста, заполните все обязательные поля');
        return;
      }

      // Реальная генерация с OpenAI
      setIsGenerating(true);
      
      try {
        console.log('Отправка запроса на генерацию, данные:', {
          bookType: selectedType,
          answers: answers
        });
        const response = await fetch('/api/generate-book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookType: selectedType,
            answers: answers
          }),
          // Таймаут 30 секунд
          signal: AbortSignal.timeout(30000)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Ошибка при генерации книги`);
        }

        const result = await response.json();
        
        if (result.success) {
          // Сохраняем сгенерированную книгу
          setGeneratedBook(result.book);
          setIsGenerating(false);
          setCurrentStep(totalSteps);
        } else {
          throw new Error(result.error || 'Неизвестная ошибка');
        }
      } catch (error) {
        console.error('Ошибка генерации:', error);
        setIsGenerating(false);
        
        if (error instanceof Error) {
          if (error.name === 'TimeoutError') {
            alert('Генерация заняла слишком много времени. Попробуйте еще раз.');
          } else {
            alert(`Ошибка: ${error.message}`);
          }
        } else {
          alert('Произошла неизвестная ошибка. Попробуйте еще раз.');
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getCurrentQuestion = (): Question | null => {
    if (!currentBookType || currentStep === 0 || currentStep >= totalSteps) return null;
    return currentBookType.questions[currentStep - 1];
  };

  const isStepComplete = (): boolean => {
    if (currentStep === 0) return selectedType !== '';
    
    const question = getCurrentQuestion();
    if (!question) return true;
    
    const answer = answers[question.id];
    console.log('Валидация шага:', question.id, 'answer:', answer, 'required:', question.required);
    
    return question.required ? !!answer && answer !== '' : true;
  };

  // Экран выбора типа книги
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              VeloraBook
            </h1>
          </Link>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Создайте вашу персональную книгу
            </h1>
            <p className="text-xl text-gray-600">
              Выберите тип книги, которую хотите создать
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {bookTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-1 transition-all duration-200 border-2 border-transparent hover:border-purple-300"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      {type.price}
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all">
                      Выбрать
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Экран генерации
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            ИИ создает вашу книгу...
          </h2>
          <p className="text-gray-600">
            Обрабатываем ваши ответы и генерируем персональную историю
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Это может занять до 30 секунд
          </p>
        </div>
      </div>
    );
  }

  // Финальный экран
  if (currentStep >= totalSteps) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ваша книга готова! 🎉
            </h2>
            {generatedBook && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{generatedBook.title}</h3>
                <p className="text-gray-600">
                  {generatedBook.totalChapters} глав • ~{generatedBook.estimatedReadTime} мин чтения
                </p>
              </div>
            )}
            <div className="space-y-4">
              <button 
                onClick={() => {
                  // Сохраняем книгу в localStorage для передачи на страницу просмотра
                  if (generatedBook) {
                    localStorage.setItem('currentBook', JSON.stringify(generatedBook));
                    window.location.href = '/book';
                  }
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Просмотреть книгу
              </button>
              <button className="w-full border border-purple-500 text-purple-500 py-3 px-6 rounded-lg hover:bg-purple-50 transition-all">
                Заказать печатную версию
              </button>
              <Link href="/">
                <button className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-all">
                  Создать еще одну книгу
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = getCurrentQuestion();
  if (!question || !currentBookType) return null;

  // Экран вопроса
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            VeloraBook
          </h1>
        </Link>
      </header>

      <div className="max-w-2xl mx-auto">
        {/* Прогресс */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Вопрос {currentStep} из {totalSteps - 2}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round((currentStep / (totalSteps - 2)) * 100)}% завершено
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / (totalSteps - 2)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Вопрос */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {question.text}
          </h2>

          {question.type === 'text' && (
            <input
              type="text"
              placeholder={question.placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={(answers[question.id] as string) || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          )}

          {question.type === 'textarea' && (
            <textarea
              placeholder={question.placeholder}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={(answers[question.id] as string) || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          )}

          {question.type === 'file' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Загрузите фотографии (до 5MB каждая)</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id={`file-upload-${question.id}`}
                onChange={(e) => handleAnswerChange(question.id, e.target.files!)}
              />
              <label
                htmlFor={`file-upload-${question.id}`}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-600 transition-all"
              >
                Выбрать файлы
              </label>
              {uploadedFiles[question.id] && uploadedFiles[question.id].length > 0 && (
                <div className="mt-3">
                  <p className="text-green-600 text-sm">
                    Загружено: {uploadedFiles[question.id].length} фото
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Навигация */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps - 1 ? 'Создать книгу' : 'Далее'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}