
# All of this fake compilation is probably unnecessary. So the only actual work is in build-console-and-editor

# Run this from root directory, which contains app.yaml
# orig_dir=`pwd`
# compiled_file=$orig_dir/static/js/compiled
# src_dir=$orig_dir/static/js/src/js-runtime

# echo 'Building support.js:';

# pushd src_dir > /dev/null

# if [ -f $compiled_file ]; then
# 	rm -f $compiled_file
# fi

# cat browser-platform.js >> $compiled_file

# for i in `cat order`; do
# 	echo '        adding' $i;
# 	cat $i >> $target_new;
# done;

# echo '    Done!'

# popd > /dev/null
