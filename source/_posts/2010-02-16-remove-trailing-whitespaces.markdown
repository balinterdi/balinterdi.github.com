---
title: Remove'em trailing whitespaces!
layout: post
---
Some of you reading this probably use TextMate. It is an excellent editor with two caveats. The first is that you can only see one file in the editing window (no screen split), the other is that there is no save hook. This latter gave me headaches since I can't stand any trailing whitespace in source code and the easiest solution would have been to run a script to remove those when the file is saved.

Without further ado I'll paste my solution below. Obviously this is not a difficult task to accomplish so the goal is to share not to show off. I use Git for SCM and the following solution parses out the files that have been modified and runs the whitespace eraser script for those. If you use something else (why do you?) you should obviously change the first building block:


{% codeblock parse_modified_files_from_git_status.rb %}
#!/usr/bin/env ruby -wn
modified_file_pattern = /^#\s+(?:modified|new file):\s+(.*)$/
puts $1  if modified_file_pattern =~ $_
{% endcodeblock %}

{% codeblock rm_trailing_whitespace.rb %}
#!/usr/bin/env ruby -wn
$:.unshift(File.dirname(__FILE__))

require "trailing_whitespace_eraser"
TrailingWhiteSpaceEraser.rm_trailing_whitespace!($_)
{% endcodeblock %}

{% codeblock trailing_whitespace_eraser.rb %}

class TrailingWhiteSpaceEraser
  FILE_TYPES = ["rb", "feature", "yml", "erb", "haml"]

  def self.rm_trailing_whitespace_from_file!(file)
    trimmed = File.readlines(file).map do |line|
      line.gsub(/[\t ]+$/, "")
    end
    open(file, "w") { |f| f.write(trimmed) }
  end

  def self.rm_trailing_whitespace!(root)
    root = File.expand_path(root)
    files = File.directory?(root) ? Dir.glob("#{root}/**/*.{#{FILE_TYPES.join(',')}}") : [root]
    files.each { |file| rm_trailing_whitespace_from_file!(file.chomp) }
  end
end
{% endcodeblock %}

And then you run it by typing:

{% codeblock rtwsp.sh %}
git status | parse_modified_files_from_git_status.rb | rm_trailing_whitespace.rb
{% endcodeblock %}

If you decide to use this, it is more convenient to [download the raw source](http://gist.github.com/raw/305654/568290aa63ee3b0b3748b5041654f94ce45f4e5b/erase_trailing_whitespace.rb)

Hopefully I did my tiny bit to have less trailing whitespace in OS code.
