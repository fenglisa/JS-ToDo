class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :complete, :due
end
