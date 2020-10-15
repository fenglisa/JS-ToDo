class TasksController < ApplicationController
  before_action :set_task, only: [:show, :update, :destroy]

  # GET /tasks
  def index
    @tasks = Task.all.by_due_date
    options = {
      include: [:user]
    }
    render json: TaskSerializer.new(@tasks, options)
  end

  # GET /tasks/1
  # def show
  #   render json: @task
  # end

  # POST /tasks
  def create
    @task = Task.new(task_params)

    if @task.save
      options = {
        include: [:user]
      }
      render json: TaskSerializer.new(@task, options)
    else
      render json: {errors:  @task.errors.full_messages}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /tasks/1
  # def update
  #   if @task.update(task_params)
  #     render json: @task
  #   else
  #     render json: @task.errors, status: :unprocessable_entity
  #   end
  # end

  # DELETE /tasks/1
  def destroy
    @task.destroy
  end

  private
    # Only allow a trusted parameter "white list" through.
    def task_params
      params.require(:task).permit(:title, :complete, :due, :user_id)
    end
end
