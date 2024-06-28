/**
 * IMPORTANT:
 * If you add a new field to the exerciseFields constant,
 * you must also update the related interface.
 */
export const EXERCISE_FIELDS = {
  exercises: {
    uid: 'uid',
    contributorId: 'contributorId',
    title: 'title',
    thumbUri: 'thumbUri',
    difficulty: 'difficulty',
    equipmentIds: 'equipmentIds',
    description: 'description',
    tagIds: 'tagIds',
    dateCreated: 'dateCreated',
    dateModified: 'dateModified',
  },
  exercise_tags: {
    uid: 'uid',
    name: 'name',
    iconUri: 'iconUri',
    tagColor: 'tagColor',
  },
  exercise_equipments: {
    uid: 'uid',
    title: 'title',
    equipmentType: 'equipmentType',
    iconUri: 'iconUri',
    tagColor: 'tagColor',
  },
};
