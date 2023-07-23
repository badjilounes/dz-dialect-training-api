// import { mock, MockProxy } from 'jest-mock-extended';

// import { GetTrainingChapterListQueryHandler } from './search-chapter.handler';

// import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
// import {
//   Chapter,
//   Training,
//   TrainingQueryRepository,
// } from '@business/student/domain/repositories/training-query-repository';

// describe('Get training chapter list', () => {
//   let handler: GetTrainingChapterListQueryHandler;

//   let trainingQueryRepository: MockProxy<TrainingQueryRepository>;

//   let chapter: Chapter;
//   let training: Training;

//   const trainingId = 'trainingId';
//   const examId = 'examId';
//   const questionId = 'questionId';

//   beforeEach(() => {
//     trainingQueryRepository = mock<TrainingQueryRepository>();
//     trainingQueryRepository.findExamById.mockResolvedValue(undefined);

//     handler = new GetTrainingChapterListQueryHandler(trainingQueryRepository);

//     chapter = {
//       id: 'chapterId',
//       name: 'chapter name',
//       description: 'chapter description',
//       order: 1,
//     };

//     training = {
//       id: trainingId,
//       chapterId: 'chapterId',
//       exams: [
//         {
//           id: examId,
//           name: 'presentation exam',
//           questions: [
//             {
//               id: questionId,
//               type: QuestionTypeEnum.WORD_LIST,
//               order: 1,
//               question: 'el makla rahi el dekhel',
//               answer: ["la nourriture est à l'intérieur"],
//               propositions: [
//                 'part',
//                 'avec',
//                 'nous',
//                 'intérieur',
//                 'quelque',
//                 'est',
//                 'est',
//                 "l'",
//                 'nourriture',
//                 'la',
//                 'à',
//               ],
//             },
//           ],
//         },
//       ],
//     };
//   });

//   it('should return the training chapter list', async () => {
//     trainingQueryRepository.findChapters.mockResolvedValue([chapter]);
//     trainingQueryRepository.findTrainingsByChapterId.mockResolvedValue([training]);

//     const result = await handler.execute();

//     expect(result).toEqual([
//       {
//         chapter,
//         trainingList: [training],
//       },
//     ]);
//   });
// });
