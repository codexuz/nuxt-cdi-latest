<template>
  <div class="container mx-auto px-4 py-8">
    <Toaster position="top-center" richColors theme="system" />

    <!-- Test Information -->
    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Test Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="space-y-2">
            <Label for="title">Test Title</Label>
            <Input
              id="title"
              v-model="testData.title"
              placeholder="e.g., IELTS Academic Test - Practice Set 1"
            />
          </div>
          <div class="space-y-2">
            <Label for="for_cdi">For CDI</Label>
            <Select v-model="testData.for_cdi">
              <SelectTrigger id="for_cdi">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="space-y-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="testData.description"
            placeholder="Describe the test content and objectives..."
            rows="3"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Section Tabs -->
    <Card>
      <Tabs v-model="activeTab" class="w-full p-3">
        <div>
          <TabsList class="w-full justify-start  p-0">
            <TabsTrigger
              value="listening"
            >
              <Headphones class="mr-2 h-4 w-4" />
              Listening
            </TabsTrigger>
            <TabsTrigger
              value="reading"
            >
              <BookOpen class="mr-2 h-4 w-4" />
              Reading
            </TabsTrigger>
            <TabsTrigger
              value="preview"
            >
              <Eye class="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <!-- Listening Section -->
        <TabsContent value="listening" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Listening Section</h3>
            <Button @click="addListeningPart">
              <Plus class="mr-2 h-4 w-4" />
              Add Part
            </Button>
          </div>

          <Accordion type="multiple" class="w-full space-y-4">
            <AccordionItem 
              v-for="(part, index) in listeningData.parts" 
              :key="index" 
              :value="`listening-part-${index}`"
              class="border rounded-lg px-4"
            >
              <AccordionTrigger class="hover:no-underline">
                <div class="flex items-center justify-between w-full pr-4">
                  <span class="font-semibold">Part {{ index + 1 }} - {{ part.part }}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click.stop="removeListeningPart(index)"
                    class="h-8 w-8"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-4 pt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label>Part Type</Label>
                    <Select v-model="part.part">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PART_1">Part 1</SelectItem>
                        <SelectItem value="PART_2">Part 2</SelectItem>
                        <SelectItem value="PART_3">Part 3</SelectItem>
                        <SelectItem value="PART_4">Part 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="space-y-2">
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      v-model.number="part.question.number_of_questions"
                      min="1"
                      max="15"
                    />
                  </div>
                </div>

                <!-- Audio Configuration -->
                <div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                      <Label>Audio URL</Label>
                      <Input
                        type="url"
                        v-model="part.audio.url"
                        placeholder="https://example.com/audio.mp3"
                      />
                    </div>
                    <div class="space-y-2">
                      <Label>File Name</Label>
                      <Input
                        v-model="part.audio.file_name"
                        placeholder="listening_part1.mp3"
                      />
                    </div>
                  </div>
                </div>

                <!-- Question Content -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="font-medium">Question Content</h5>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button size="sm" variant="outline">
                          <Plus class="mr-1 h-3 w-3" />
                          Add Question Type
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'completion')">
                          Completion
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'multiple-choice')">
                          Multiple Choice
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'multi-select')">
                          Multi Select
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'draggable-selection')">
                          Draggable Selection
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'selection')">
                          Selection (True/False/Headings)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div
                    v-for="(content, contentIndex) in part.question.content"
                    :key="contentIndex"
                    class="mb-4"
                  >
                    <CompletionQuestion
                      v-if="content.type === 'completion'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                    <MultipleChoiceQuestion
                      v-else-if="content.type === 'multiple-choice'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                    <MultiSelectQuestion
                      v-else-if="content.type === 'multi-select'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                    <DraggableSelectionQuestion
                      v-else-if="content.type === 'draggable-selection'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                    <SelectionQuestion
                      v-else-if="content.type === 'selection'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                  </div>
                </div>

                <!-- Visual Answer Entry UI -->
                <div v-if="part.question.content.length > 0" class="space-y-2 mt-6">
                  <div class="flex justify-between items-center">
                    <Label class="text-base">Answer Key</Label>
                  </div>
                  <Card class="bg-muted/30">
                    <CardContent class="p-4 space-y-4">
                      <div v-for="(content, contentIndex) in part.question.content" :key="contentIndex">
                        <!-- Multiple Choice Answers -->
                        <div v-if="content.type === 'multiple-choice' && content.questions" class="space-y-4">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Multiple Choice Section' }}
                          </div>
                          <div v-for="(question, qIndex) in content.questions" :key="question.id" class="border rounded-lg p-3 space-y-2">
                            <Label class="text-sm font-semibold">Question {{ getQuestionNumber(part, contentIndex, qIndex) }}:</Label>
                            <div class="text-xs text-muted-foreground mb-2">{{ question.question }}</div>
                            <div class="space-y-2">
                              <div v-for="option in question.options" :key="option.id" class="flex items-center space-x-2">
                                <Checkbox
                                  :id="`lq${getQuestionNumber(part, contentIndex, qIndex)}-${option.id}`"
                                  :checked="part.answers[getQuestionNumber(part, contentIndex, qIndex)] === option.value"
                                  @update:checked="(checked) => {
                                    if (checked) {
                                      part.answers[getQuestionNumber(part, contentIndex, qIndex)] = option.value;
                                    } else {
                                      delete part.answers[getQuestionNumber(part, contentIndex, qIndex)];
                                    }
                                  }"
                                />
                                <Label :for="`lq${getQuestionNumber(part, contentIndex, qIndex)}-${option.id}`" class="cursor-pointer">
                                  {{ option.value }} - {{ option.label }}
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Multi-Select Answers -->
                        <div v-if="content.type === 'multi-select'" class="space-y-3 border rounded-lg p-3">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Multi-Select Section' }}
                          </div>
                          <div class="space-y-2">
                            <Label class="text-sm">Questions {{ getQuestionNumber(part, contentIndex, 0) }}-{{ getQuestionNumber(part, contentIndex, (content.limit || 2) - 1) }}:</Label>
                            <div class="text-xs text-muted-foreground mb-2">Select {{ content.limit || 2 }} correct answers</div>
                            <div class="space-y-2">
                              <div v-for="option in content.options" :key="option.id" class="flex items-center space-x-2">
                                <Checkbox
                                  :id="`lms-${contentIndex}-${option.id}`"
                                  :checked="isMultiSelectAnswerSelected(part, contentIndex, option.value)"
                                  @update:checked="() => toggleMultiSelectAnswer(part, contentIndex, option.value, content.limit || 2)"
                                />
                                <Label :for="`lms-${contentIndex}-${option.id}`" class="cursor-pointer">
                                  {{ option.value }} - {{ option.label }}
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Selection (Dropdown) Answers -->
                        <div v-if="content.type === 'selection'" class="space-y-3 border rounded-lg p-3">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Selection Section' }}
                          </div>
                          <div class="space-y-3">
                            <div v-for="(blank, blankIndex) in countBlanks(content.content)" :key="blankIndex" class="space-y-2">
                              <Label class="text-sm font-semibold">Question {{ getQuestionNumber(part, contentIndex, blankIndex) }}:</Label>
                              <div class="space-y-2 pl-4">
                                <div v-for="option in content.options" :key="option.id" class="flex items-center space-x-2">
                                  <Checkbox
                                    :id="`lsel-${contentIndex}-${blankIndex}-${option.id}`"
                                    :checked="part.answers[getQuestionNumber(part, contentIndex, blankIndex)] === option.value"
                                    @update:checked="(checked) => {
                                      if (checked) {
                                        part.answers[getQuestionNumber(part, contentIndex, blankIndex)] = option.value;
                                      } else {
                                        delete part.answers[getQuestionNumber(part, contentIndex, blankIndex)];
                                      }
                                    }"
                                  />
                                  <Label :for="`lsel-${contentIndex}-${blankIndex}-${option.id}`" class="cursor-pointer">
                                    {{ option.value }}{{ option.label ? ' - ' + option.label : '' }}
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Completion Type Answers -->
                        <div v-if="content.type === 'completion'" class="space-y-3 border rounded-lg p-3">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Completion Section' }}
                          </div>
                          <div class="space-y-2">
                            <Label class="text-sm">Questions {{ getQuestionNumber(part, contentIndex, 0) }} - {{ getQuestionNumber(part, contentIndex, countBlanks(content.content).length - 1) }}</Label>
                            <Textarea
                              :value="getCommaSeparatedAnswers(part, contentIndex, countBlanks(content.content).length)"
                              @input="(e) => setCommaSeparatedAnswers(part, contentIndex, countBlanks(content.content).length, e.target.value)"
                              placeholder="Enter answers separated by commas (e.g., answer1, answer2, answer3)"
                              rows="3"
                              class="font-mono text-sm"
                            />
                            <p class="text-xs text-muted-foreground">
                              Enter {{ countBlanks(content.content).length }} answers separated by commas
                            </p>
                          </div>
                        </div>

                        <!-- Draggable Selection Answers -->
                        <div v-if="content.type === 'draggable-selection'" class="space-y-3 border rounded-lg p-3">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Draggable Selection Section' }}
                          </div>
                          <div class="space-y-2">
                            <Label class="text-sm">Questions {{ getQuestionNumber(part, contentIndex, 0) }} - {{ getQuestionNumber(part, contentIndex, countBlanks(content.content).length - 1) }}</Label>
                            <Textarea
                              :value="getCommaSeparatedAnswers(part, contentIndex, countBlanks(content.content).length)"
                              @input="(e) => setCommaSeparatedAnswers(part, contentIndex, countBlanks(content.content).length, e.target.value)"
                              placeholder="Enter answers separated by commas (e.g., answer1, answer2, answer3)"
                              rows="3"
                              class="font-mono text-sm"
                            />
                            <p class="text-xs text-muted-foreground">
                              Enter {{ countBlanks(content.content).length }} answers separated by commas
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <!-- Reading Section -->
        <TabsContent value="reading" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Reading Section</h3>
            <Button @click="addReadingPart">
              <Plus class="mr-2 h-4 w-4" />
              Add Part
            </Button>
          </div>

          <Accordion type="multiple" class="w-full space-y-4">
            <AccordionItem 
              v-for="(part, index) in readingData.parts" 
              :key="index" 
              :value="`reading-part-${index}`"
              class="border rounded-lg px-4"
            >
              <AccordionTrigger class="hover:no-underline">
                <div class="flex items-center justify-between w-full pr-4">
                  <span class="font-semibold">Part {{ index + 1 }} - {{ part.part }}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click.stop="removeReadingPart(index)"
                    class="h-8 w-8"
                  >
                    <Trash2 class="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent class="space-y-4 pt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label>Part Type</Label>
                    <Select v-model="part.part">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PART_1">Part 1</SelectItem>
                        <SelectItem value="PART_2">Part 2</SelectItem>
                        <SelectItem value="PART_3">Part 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div class="space-y-2">
                    <Label>Number of Questions</Label>
                    <Input
                      type="number"
                      v-model.number="part.question.number_of_questions"
                      min="1"
                      max="15"
                    />
                  </div>
                </div>

                <!-- Reading Passage -->
                <div class="space-y-2">
                  <Label>Reading Passage (HTML supported)</Label>
                  <Textarea
                    v-model="part.passage"
                    placeholder="Enter the reading passage text here..."
                    rows="8"
                  />
                </div>

                <!-- Question Content -->
                <div>
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="font-medium">Question Content</h5>
                    <DropdownMenu>
                      <DropdownMenuTrigger as-child>
                        <Button size="sm" variant="outline">
                          <Plus class="mr-1 h-3 w-3" />
                          Add Question Type
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'completion')">
                          Completion
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'multiple-choice')">
                          Multiple Choice
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'multi-select')">
                          Multi Select
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'draggable-selection')">
                          Draggable Selection
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addQuestionByType(part.question.content, 'selection')">
                          Selection (True/False/Headings)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div
                    v-for="(content, contentIndex) in part.question.content"
                    :key="contentIndex"
                    class="mb-4"
                  >
                    <CompletionQuestion
                      v-if="content.type === 'completion'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                    <MultipleChoiceQuestion
                      v-else-if="content.type === 'multiple-choice'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                    <MultiSelectQuestion
                      v-else-if="content.type === 'multi-select'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                    <DraggableSelectionQuestion
                      v-else-if="content.type === 'draggable-selection'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                    <SelectionQuestion
                      v-else-if="content.type === 'selection'"
                      v-model="part.question.content[contentIndex]"
                      @remove="part.question.content.splice(contentIndex, 1)"
                    />
                  </div>
                </div>

                <!-- Visual Answer Entry UI -->
                <div v-if="part.question.content.length > 0" class="space-y-2 mt-6">
                  <div class="flex justify-between items-center">
                    <Label class="text-base">Answer Key</Label>
                  </div>
                  <Card class="bg-muted/30">
                    <CardContent class="p-4 space-y-4">
                      <div v-for="(content, contentIndex) in part.question.content" :key="contentIndex">
                        <!-- Multiple Choice Answers -->
                        <div v-if="content.type === 'multiple-choice' && content.questions" class="space-y-4">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Multiple Choice Section' }}
                          </div>
                          <div v-for="(question, qIndex) in content.questions" :key="question.id" class="border rounded-lg p-3 space-y-2">
                            <Label class="text-sm font-semibold">Question {{ getQuestionNumber(part, contentIndex, qIndex) }}:</Label>
                            <div class="text-xs text-muted-foreground mb-2">{{ question.question }}</div>
                            <div class="space-y-2">
                              <div v-for="option in question.options" :key="option.id" class="flex items-center space-x-2">
                                <Checkbox
                                  :id="`rq${getQuestionNumber(part, contentIndex, qIndex)}-${option.id}`"
                                  :checked="part.answers[getQuestionNumber(part, contentIndex, qIndex)] === option.value"
                                  @update:checked="(checked) => {
                                    if (checked) {
                                      part.answers[getQuestionNumber(part, contentIndex, qIndex)] = option.value;
                                    } else {
                                      delete part.answers[getQuestionNumber(part, contentIndex, qIndex)];
                                    }
                                  }"
                                />
                                <Label :for="`rq${getQuestionNumber(part, contentIndex, qIndex)}-${option.id}`" class="cursor-pointer">
                                  {{ option.value }} - {{ option.label }}
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Multi-Select Answers -->
                        <div v-if="content.type === 'multi-select'" class="space-y-3 border rounded-lg p-3">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Multi-Select Section' }}
                          </div>
                          <div class="space-y-2">
                            <Label class="text-sm">Questions {{ getQuestionNumber(part, contentIndex, 0) }}-{{ getQuestionNumber(part, contentIndex, (content.limit || 2) - 1) }}:</Label>
                            <div class="text-xs text-muted-foreground mb-2">Select {{ content.limit || 2 }} correct answers</div>
                            <div class="space-y-2">
                              <div v-for="option in content.options" :key="option.id" class="flex items-center space-x-2">
                                <Checkbox
                                  :id="`rms-${contentIndex}-${option.id}`"
                                  :checked="isMultiSelectAnswerSelected(part, contentIndex, option.value)"
                                  @update:checked="() => toggleMultiSelectAnswer(part, contentIndex, option.value, content.limit || 2)"
                                />
                                <Label :for="`rms-${contentIndex}-${option.id}`" class="cursor-pointer">
                                  {{ option.value }} - {{ option.label }}
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Selection (Dropdown) Answers -->
                        <div v-if="content.type === 'selection'" class="space-y-3 border rounded-lg p-3">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Selection Section' }}
                          </div>
                          <div class="space-y-3">
                            <div v-for="(blank, blankIndex) in countBlanks(content.content)" :key="blankIndex" class="space-y-2">
                              <Label class="text-sm font-semibold">Question {{ getQuestionNumber(part, contentIndex, blankIndex) }}:</Label>
                              <div class="space-y-2 pl-4">
                                <div v-for="option in content.options" :key="option.id" class="flex items-center space-x-2">
                                  <Checkbox
                                    :id="`rsel-${contentIndex}-${blankIndex}-${option.id}`"
                                    :checked="part.answers[getQuestionNumber(part, contentIndex, blankIndex)] === option.value"
                                    @update:checked="(checked) => {
                                      if (checked) {
                                        part.answers[getQuestionNumber(part, contentIndex, blankIndex)] = option.value;
                                      } else {
                                        delete part.answers[getQuestionNumber(part, contentIndex, blankIndex)];
                                      }
                                    }"
                                  />
                                  <Label :for="`rsel-${contentIndex}-${blankIndex}-${option.id}`" class="cursor-pointer">
                                    {{ option.value }}{{ option.label ? ' - ' + option.label : '' }}
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Completion Type Answers -->
                        <div v-if="content.type === 'completion'" class="space-y-3 border rounded-lg p-3">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Completion Section' }}
                          </div>
                          <div class="space-y-2">
                            <Label class="text-sm">Questions {{ getQuestionNumber(part, contentIndex, 0) }} - {{ getQuestionNumber(part, contentIndex, countBlanks(content.content).length - 1) }}</Label>
                            <Textarea
                              :value="getCommaSeparatedAnswers(part, contentIndex, countBlanks(content.content).length)"
                              @input="(e) => setCommaSeparatedAnswers(part, contentIndex, countBlanks(content.content).length, e.target.value)"
                              placeholder="Enter answers separated by commas (e.g., answer1, answer2, answer3)"
                              rows="3"
                              class="font-mono text-sm"
                            />
                            <p class="text-xs text-muted-foreground">
                              Enter {{ countBlanks(content.content).length }} answers separated by commas
                            </p>
                          </div>
                        </div>

                        <!-- Draggable Selection Answers -->
                        <div v-if="content.type === 'draggable-selection'" class="space-y-3 border rounded-lg p-3">
                          <div class="font-medium text-sm flex items-center gap-2">
                            <Badge variant="outline">{{ content.type }}</Badge>
                            {{ content.title || 'Draggable Selection Section' }}
                          </div>
                          <div class="space-y-2">
                            <Label class="text-sm">Questions {{ getQuestionNumber(part, contentIndex, 0) }} - {{ getQuestionNumber(part, contentIndex, countBlanks(content.content).length - 1) }}</Label>
                            <Textarea
                              :value="getCommaSeparatedAnswers(part, contentIndex, countBlanks(content.content).length)"
                              @input="(e) => setCommaSeparatedAnswers(part, contentIndex, countBlanks(content.content).length, e.target.value)"
                              placeholder="Enter answers separated by commas (e.g., answer1, answer2, answer3)"
                              rows="3"
                              class="font-mono text-sm"
                            />
                            <p class="text-xs text-muted-foreground">
                              Enter {{ countBlanks(content.content).length }} answers separated by commas
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>

        <!-- Preview Section -->
        <TabsContent value="preview" class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Test Preview</h3>
            <div class="flex gap-2">
              <Button @click="exportTest" variant="default">
                <Download class="mr-2 h-4 w-4" />
                Export JSON
              </Button>
              <Button @click="copyToClipboard" variant="outline">
                <Copy class="mr-2 h-4 w-4" />
                Copy JSON
              </Button>
            </div>
          </div>

          <Card class="bg-slate-950 text-green-400 overflow-auto max-h-96">
            <CardContent class="p-4">
              <pre class="text-xs">{{ generatedJSON }}</pre>
            </CardContent>
          </Card>

          <!-- Test Summary -->
          <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card class="bg-blue-50 dark:bg-blue-950">
              <CardContent class="p-4">
                <div class="flex items-center">
                  <Headphones class="text-blue-500 h-8 w-8 mr-3" />
                  <div>
                    <p class="text-sm font-medium">Listening Parts</p>
                    <p class="text-2xl font-bold text-blue-600">{{ listeningData.parts.length }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card class="bg-green-50 dark:bg-green-950">
              <CardContent class="p-4">
                <div class="flex items-center">
                  <BookOpen class="text-green-500 h-8 w-8 mr-3" />
                  <div>
                    <p class="text-sm font-medium">Reading Parts</p>
                    <p class="text-2xl font-bold text-green-600">{{ readingData.parts.length }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card class="bg-purple-50 dark:bg-purple-950">
              <CardContent class="p-4">
                <div class="flex items-center">
                  <FileQuestion class="text-purple-500 h-8 w-8 mr-3" />
                  <div>
                    <p class="text-sm font-medium">Total Questions</p>
                    <p class="text-2xl font-bold text-purple-600">{{ totalQuestions }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  </div>
</template>

<script setup>
import {
  Plus,
  Trash2,
  X,
  Eye,
  Download,
  Copy,
  Headphones,
  BookOpen,
  FileQuestion,
} from "lucide-vue-next";
import { toast, Toaster } from "vue-sonner";
import "vue-sonner/style.css";

// Import question builder components
import CompletionQuestion from '@/components/questions/CompletionQuestion.vue';
import MultipleChoiceQuestion from '@/components/questions/MultipleChoiceQuestion.vue';
import MultiSelectQuestion from '@/components/questions/MultiSelectQuestion.vue';
import DraggableSelectionQuestion from '@/components/questions/DraggableSelectionQuestion.vue';
import SelectionQuestion from '@/components/questions/SelectionQuestion.vue';

// Import dropdown menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import accordion components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

useHead({
  title: "IELTS Test Builder - Testify",
});

const activeTab = ref("listening");

const testData = ref({
  title: "",
  description: "",
  for_cdi: false,
});

const listeningData = ref({
  title: "",
  description: "",
  for_cdi: false,
  parts: [],
});

const readingData = ref({
  title: "",
  description: "",
  for_cdi: false,
  parts: [],
});

// Add listening part
const addListeningPart = () => {
  const newPart = {
    part: "PART_1",
    question: {
      content: [],
      number_of_questions: 10,
    },
    audio: {
      url: "",
      file_name: "",
      duration: 180,
      file_size: "1mb",
    },
    answers: {},
  };
  listeningData.value.parts.push(newPart);
};

// Remove listening part
const removeListeningPart = (index) => {
  listeningData.value.parts.splice(index, 1);
};

// Add reading part
const addReadingPart = () => {
  readingData.value.parts.push({
    part: "PART_1",
    question: {
      content: [],
      number_of_questions: 13,
    },
    passage: "",
    answers: {},
  });
};

// Helper function to count blanks (@@) in content
const countBlanks = (content) => {
  if (!content) return [];
  const matches = content.match(/@@/g);
  return matches ? matches : [];
};

// Helper function to get question number based on previous content
const getQuestionNumber = (part, contentIndex, itemIndex) => {
  let questionNumber = 1;
  
  // Count questions from previous content blocks
  for (let i = 0; i < contentIndex; i++) {
    const content = part.question.content[i];
    if (content.type === 'completion' || content.type === 'selection' || content.type === 'draggable-selection') {
      questionNumber += countBlanks(content.content).length;
    } else if (content.type === 'multiple-choice') {
      questionNumber += content.questions?.length || 0;
    } else if (content.type === 'multi-select') {
      questionNumber += content.limit || 2;
    }
  }
  
  return String(questionNumber + itemIndex);
};

// Helper function to check if multi-select answer is selected
const isMultiSelectAnswerSelected = (part, contentIndex, value) => {
  const startQuestion = parseInt(getQuestionNumber(part, contentIndex, 0));
  const content = part.question.content[contentIndex];
  const limit = content.limit || 2;
  
  for (let i = 0; i < limit; i++) {
    if (part.answers[String(startQuestion + i)] === value) {
      return true;
    }
  }
  return false;
};

// Helper function to toggle multi-select answer
const toggleMultiSelectAnswer = (part, contentIndex, value, limit) => {
  const startQuestion = parseInt(getQuestionNumber(part, contentIndex, 0));
  
  // Check if value is already selected
  let selectedIndex = -1;
  for (let i = 0; i < limit; i++) {
    if (part.answers[String(startQuestion + i)] === value) {
      selectedIndex = i;
      break;
    }
  }
  
  if (selectedIndex !== -1) {
    // Remove the value
    delete part.answers[String(startQuestion + selectedIndex)];
    // Shift remaining values
    for (let i = selectedIndex; i < limit - 1; i++) {
      const nextValue = part.answers[String(startQuestion + i + 1)];
      if (nextValue) {
        part.answers[String(startQuestion + i)] = nextValue;
        delete part.answers[String(startQuestion + i + 1)];
      }
    }
  } else {
    // Add the value to the first empty slot
    for (let i = 0; i < limit; i++) {
      if (!part.answers[String(startQuestion + i)]) {
        part.answers[String(startQuestion + i)] = value;
        break;
      }
    }
  }
};

// Helper function to get comma-separated answers
const getCommaSeparatedAnswers = (part, contentIndex, count) => {
  const startQuestion = parseInt(getQuestionNumber(part, contentIndex, 0));
  const answers = [];
  for (let i = 0; i < count; i++) {
    const answer = part.answers[String(startQuestion + i)];
    answers.push(answer || '');
  }
  return answers.join(', ');
};

// Helper function to set comma-separated answers
const setCommaSeparatedAnswers = (part, contentIndex, count, value) => {
  const startQuestion = parseInt(getQuestionNumber(part, contentIndex, 0));
  const answers = value.split(',').map(a => a.trim());
  
  for (let i = 0; i < count; i++) {
    const answer = answers[i];
    if (answer) {
      part.answers[String(startQuestion + i)] = answer;
    } else {
      delete part.answers[String(startQuestion + i)];
    }
  }
};

// Remove reading part
const removeReadingPart = (index) => {
  readingData.value.parts.splice(index, 1);
};

// Add question by type
const addQuestionByType = (contentArray, type) => {
  const baseQuestion = {
    id: `qc_${Date.now()}`,
    type: type,
    title: "",
    condition: "",
  };

  switch (type) {
    case 'completion':
      contentArray.push({
        ...baseQuestion,
        content: "",
      });
      break;
    case 'multiple-choice':
      contentArray.push({
        ...baseQuestion,
        questions: [],
      });
      break;
    case 'multi-select':
      contentArray.push({
        ...baseQuestion,
        options: [],
        limit: 2,
      });
      break;
    case 'draggable-selection':
      contentArray.push({
        ...baseQuestion,
        content: "",
        options: [],
        optionsTitle: "",
      });
      break;
    case 'selection':
      contentArray.push({
        ...baseQuestion,
        content: "",
        options: [],
        showOptions: true,
        optionsTitle: "OPTIONS",
      });
      break;
    default:
      contentArray.push(baseQuestion);
  }
};

// Add question content (deprecated - kept for compatibility)
const addQuestionContent = (contentArray) => {
  addQuestionByType(contentArray, 'completion');
};

// Calculate total questions
const totalQuestions = computed(() => {
  let total = 0;
  listeningData.value.parts.forEach((part) => {
    total += part.question.number_of_questions || 0;
  });
  readingData.value.parts.forEach((part) => {
    total += part.question.number_of_questions || 0;
  });
  return total;
});

// Generate JSON
const generatedJSON = computed(() => {
  const testObject = {
    test: testData.value,
    listening:
      listeningData.value.parts.length > 0 ? listeningData.value : null,
    reading: readingData.value.parts.length > 0 ? readingData.value : null,
  };
  return JSON.stringify(testObject, null, 2);
});

// Export test as JSON file
const exportTest = () => {
  const blob = new Blob([generatedJSON.value], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ielts-test-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("Test exported successfully!");
};

// Copy JSON to clipboard
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedJSON.value);
    toast.success("JSON copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy: ", err);
    toast.error("Failed to copy to clipboard");
  }
};

// Initialize with sample data
onMounted(() => {
  testData.value = {
    title: "IELTS Academic Test - Practice Set 1",
    description:
      "A comprehensive IELTS Academic test designed for intermediate to advanced students preparing for their IELTS examination.",
    for_cdi: true,
  };

  listeningData.value = {
    title: "IELTS Listening Test - Academic Module",
    description:
      "A comprehensive listening test with 4 parts covering everyday conversations and academic lectures.",
    for_cdi: true,
    parts: [],
  };

  readingData.value = {
    title: "IELTS Reading Test - Academic Module",
    description:
      "A comprehensive reading test featuring three passages with increasing difficulty levels.",
    for_cdi: false,
    parts: [],
  };
});

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
