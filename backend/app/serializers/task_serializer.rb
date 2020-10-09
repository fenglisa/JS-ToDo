class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :complete, :due
  belongs_to :user
end
