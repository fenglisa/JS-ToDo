class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :title
      t.boolean :complete, default: false
      t.date :due
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
